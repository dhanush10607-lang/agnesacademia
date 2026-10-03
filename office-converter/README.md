# Agnes Academia Office preview service

This small service converts `.doc`, `.docx`, `.ppt`, and `.pptx` files to PDF with LibreOffice. It is intended for Render's free Docker web service. Conversion happens on the service, while the original files remain in Supabase and the existing download links continue to download those originals.

PowerPoint files use LibreOffice Impress's explicit PDF export filter, and the service checks the generated PDF signature and end marker before returning a preview.

## Deploy to Render

Create a **Web Service** from this repository and choose **Docker**. Set the service's root directory to `office-converter` and select the **Free** instance plan. Render's free instance has 512 MB RAM and 0.1 CPU, sleeps after 15 minutes without traffic, and can take about a minute to wake. Larger documents may fail or time out. Uploaded and converted files are temporary and deleted after each request.

Add these environment variables to the Render service:

- `OFFICE_PREVIEW_TOKEN_SECRET`: the same random secret (at least 32 characters) configured on Vercel.
- `SUPABASE_URL`: the project's public Supabase URL, for example `https://<project-ref>.supabase.co`.
- `APP_ORIGINS`: comma-separated application origins, for example `https://agnesacademia.vercel.app,http://localhost:3000`.

After deploying, copy the service URL (for example `https://agnes-office-preview.onrender.com`) into the Vercel environment variable `NEXT_PUBLIC_OFFICE_CONVERTER_URL`. Configure `OFFICE_PREVIEW_TOKEN_SECRET` in Vercel with the exact same secret value as Render, then redeploy the Vercel app.

Generate a secret locally rather than committing it:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Render's free plan provides 750 service hours per workspace per month and suspends free services if that allowance is exhausted. To avoid overage charges, use only the Free plan and do not add a payment method; Render says it suspends Free services when outbound bandwidth limits are reached if no payment method is attached. Check Render's current [free instance limitations](https://render.com/docs/free) before deployment.

## Local development

Build and run the container with the same environment variables:

```powershell
docker build -t agnes-office-preview .\office-converter
docker run --rm -p 10000:10000 `
  -e PORT=10000 `
  -e OFFICE_PREVIEW_TOKEN_SECRET="<same-secret-as-Vercel>" `
  -e SUPABASE_URL="https://<project-ref>.supabase.co" `
  -e APP_ORIGINS="http://localhost:3000" `
  agnes-office-preview
```
