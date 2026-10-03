import base64
import binascii
import hashlib
import hmac
import json
import os
import re
import subprocess
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

MAX_SOURCE_BYTES = 15 * 1024 * 1024
MAX_PDF_BYTES = 40 * 1024 * 1024
TICKET_MAX_AGE_SECONDS = 5 * 60
SUPPORTED_EXTENSION = re.compile(r"\.(docx?|pptx?)$", re.IGNORECASE)

ticket_secret = os.environ.get("OFFICE_PREVIEW_TOKEN_SECRET", "")
supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("APP_ORIGINS", "").split(",")
    if origin.strip()
]

app = FastAPI()
conversion_lock = threading.Lock()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ConversionRequest(BaseModel):
    ticket: str = Field(max_length=4096)


def decode_ticket(ticket: str) -> str:
    if not ticket_secret or len(ticket_secret) < 32:
        raise HTTPException(status_code=503, detail="Office preview service is not configured.")

    try:
        payload_part, supplied_signature = ticket.split(".", 1)
        expected_signature = hmac.new(
            ticket_secret.encode(),
            payload_part.encode(),
            hashlib.sha256,
        ).digest()
        supplied_bytes = base64.urlsafe_b64decode(
            supplied_signature + "=" * (-len(supplied_signature) % 4)
        )
        if not hmac.compare_digest(expected_signature, supplied_bytes):
            raise ValueError("Invalid ticket signature")

        payload = json.loads(
            base64.urlsafe_b64decode(payload_part + "=" * (-len(payload_part) % 4))
        )
        file_path = payload["path"]
        expires_at = payload["exp"]
        now = int(time.time())
        if not isinstance(file_path, str) or not isinstance(expires_at, int):
            raise ValueError("Invalid ticket payload")
        if expires_at < now or expires_at > now + TICKET_MAX_AGE_SECONDS + 60:
            raise ValueError("Expired ticket")
        if (
            not file_path
            or len(file_path) > 1200
            or file_path.startswith("/")
            or "\\" in file_path
            or "\0" in file_path
            or any(part in ("", ".", "..") for part in file_path.split("/"))
            or not SUPPORTED_EXTENSION.search(file_path)
        ):
            raise ValueError("Unsupported path")
        return file_path
    except (
        ValueError,
        KeyError,
        TypeError,
        UnicodeDecodeError,
        binascii.Error,
        json.JSONDecodeError,
    ) as error:
        raise HTTPException(status_code=401, detail="Invalid or expired preview ticket.") from error


def download_source(file_path: str) -> bytes:
    if not supabase_url:
        raise HTTPException(status_code=503, detail="Office preview storage is not configured.")

    encoded_path = "/".join(urllib.parse.quote(part, safe="") for part in file_path.split("/"))
    source_url = f"{supabase_url}/storage/v1/object/public/resources/{encoded_path}"
    request = urllib.request.Request(source_url, headers={"User-Agent": "AgnesAcademiaOfficePreview/1.0"})

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            declared_size = response.headers.get("Content-Length")
            if declared_size and int(declared_size) > MAX_SOURCE_BYTES:
                raise HTTPException(status_code=413, detail="Office files must be 15 MB or smaller.")

            data = response.read(MAX_SOURCE_BYTES + 1)
            if len(data) > MAX_SOURCE_BYTES:
                raise HTTPException(status_code=413, detail="Office files must be 15 MB or smaller.")
            return data
    except HTTPException:
        raise
    except (urllib.error.URLError, TimeoutError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Could not retrieve the original Office file.") from error


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/convert")
def convert_document(request: ConversionRequest):
    if not conversion_lock.acquire(blocking=False):
        raise HTTPException(status_code=429, detail="Another file is being converted. Try again shortly.")

    try:
        return convert_ticket(request.ticket)
    finally:
        conversion_lock.release()


def convert_ticket(ticket: str) -> Response:
    file_path = decode_ticket(ticket)
    extension = Path(file_path).suffix.lower()
    source = download_source(file_path)

    with tempfile.TemporaryDirectory(prefix="agnes-office-") as temp_dir:
        working_dir = Path(temp_dir)
        source_file = working_dir / f"source{extension}"
        output_dir = working_dir / "output"
        profile_dir = working_dir / "profile"
        output_dir.mkdir()
        source_file.write_bytes(source)

        try:
            result = subprocess.run(
                [
                    "soffice",
                    "--headless",
                    f"-env:UserInstallation={profile_dir.as_uri()}",
                    "--convert-to",
                    "pdf",
                    "--outdir",
                    str(output_dir),
                    str(source_file),
                ],
                check=False,
                capture_output=True,
                text=True,
                timeout=150,
            )
        except subprocess.TimeoutExpired as error:
            raise HTTPException(
                status_code=504,
                detail="Conversion took too long on the free server. Try a smaller document.",
            ) from error
        except OSError as error:
            raise HTTPException(status_code=503, detail="LibreOffice is unavailable.") from error

        pdf_file = output_dir / "source.pdf"
        if result.returncode != 0 or not pdf_file.is_file():
            raise HTTPException(
                status_code=422,
                detail="LibreOffice could not convert this document. It may be damaged or unsupported.",
            )

        pdf_data = pdf_file.read_bytes()
        if len(pdf_data) > MAX_PDF_BYTES:
            raise HTTPException(status_code=413, detail="The converted PDF is too large to preview.")

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={
            "Cache-Control": "no-store",
            "Content-Disposition": 'inline; filename="office-preview.pdf"',
        },
    )
