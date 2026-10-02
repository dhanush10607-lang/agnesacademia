"use client";

import { useState } from "react";
import { createResourceRecords } from "@/app/actions/upload";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UploadForm({
  categories,
  subjects
}: {
  categories: { id: string; name: string }[];
  subjects: { id: string; name: string; semester: { name: string } }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const ALLOWED_TYPES = ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg", "image/png", "application/zip"];
  const MAX_SIZE_MB = 50;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setUploadProgress("");
    setProgressPercent(0);

    const formData = new FormData(e.currentTarget);
    const files = formData.getAll("files") as File[];
    const titleBase = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subjectId = formData.get("subject_id") as string;
    const categoryId = formData.get("category_id") as string;

    if (!files || files.length === 0 || files[0].size === 0) {
      setErrorMsg("Please select at least one file to upload.");
      setIsSubmitting(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg("You must be logged in to upload files.");
      setIsSubmitting(false);
      return;
    }

    const recordsToInsert = [];

    // Client-side batch upload loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading file ${i + 1} of ${files.length}: ${file.name}...`);
      setProgressPercent(0);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg(`File type not supported for ${file.name}. Please upload PDF, DOCX, PPTX, JPG, PNG, or ZIP.`);
        setIsSubmitting(false);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorMsg(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_SIZE_MB} MB.`);
        setIsSubmitting(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const safeFilename = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${user.id}/${safeFilename}`;

      // Simulate progress visually for the user
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += (95 - currentProgress) * 0.1;
        setProgressPercent(Math.floor(currentProgress));
      }, 200);

      // Chunk-wise / Stream upload natively via supabase-js
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setProgressPercent(100);

      if (uploadError) {
        console.error("Storage error:", uploadError);
        setErrorMsg(`Failed to upload ${file.name}`);
        setIsSubmitting(false);
        return;
      }

      // Generate a distinct title if multiple files
      const finalTitle = files.length > 1 ? `${titleBase} (Part ${i + 1})` : titleBase;

      recordsToInsert.push({
        title: finalTitle,
        description,
        subject_id: subjectId,
        category_id: categoryId,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });
    }

    setUploadProgress("Finalizing submission...");
    setProgressPercent(100);
    const result = await createResourceRecords(recordsToInsert);
    
    setIsSubmitting(false);
    setUploadProgress("");

    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMsg(result.error || "We couldn't finalize your upload. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mb-2">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold">Upload Successful!</h3>
        <p className="text-muted-foreground max-w-md">
          Your resources have been submitted for review. Once approved by a moderator, they will be published.
        </p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => { setSuccess(false); setUploadProgress(""); setProgressPercent(0); }} variant="outline">Upload More</Button>
          <Button onClick={() => router.push("/my-submissions")}>View My Submissions</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
          {errorMsg}
        </div>
      )}
      
      {uploadProgress && (
        <div className="p-4 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-xl space-y-3">
          <div className="flex justify-between text-sm font-medium text-blue-800 dark:text-blue-300">
            <span>{uploadProgress}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-blue-200/50 dark:bg-blue-950 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category_id">Resource Type <span className="text-red-500">*</span></Label>
        <Select name="category_id" required disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Select resource type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject_id">Subject <span className="text-red-500">*</span></Label>
        <Select name="subject_id" required disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name} {s.semester?.name ? `(${s.semester.name})` : ''}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" placeholder="E.g., Module 3 Handwritten Notes" required disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Briefly describe what this resource contains..." rows={3} disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="files">Files (Batch Upload) <span className="text-red-500">*</span></Label>
        <Input id="files" name="files" type="file" required multiple className="cursor-pointer" disabled={isSubmitting} />
        <p className="text-xs text-muted-foreground mt-1">
          Max size: 50MB per file. Allowed: PDF, DOC, PPT, Images, ZIP. You can select multiple files at once.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          "Uploading..."
        ) : (
          <>
            <UploadCloud className="w-4 h-4 mr-2" /> Submit for Review
          </>
        )}
      </Button>
    </form>
  );
}
