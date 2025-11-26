import { useCallback, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  isFolder: boolean;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  fileCount?: number;
  file?: File;
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadName, setUploadName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("");
  const [maxDownloads, setMaxDownloads] = useState("unlimited");
  const [allowPreview, setAllowPreview] = useState<boolean>(true);
  const [shareLink, setShareLink] = useState<string>("");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const supabase = createClient();

  const processFiles = useCallback(
    (
      items: FileList | File[],
      folderName: string | null = null
    ): UploadedFile[] => {
      const newFiles: UploadedFile[] = [];
      let totalSize = 0;
      let fileCount = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item?.type || item?.size) {
          totalSize = totalSize + item.size;
          fileCount++;
        }
      }

      if (folderName) {
        newFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          name: folderName,
          size: totalSize,
          type: "folder",
          isFolder: true,
          fileCount,
          progress: 0,
          status: "pending",
        });
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as File;
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: item.name,
            size: item.size,
            type: item.type || "file",
            isFolder: false,
            progress: 0,
            status: "pending",
            file: item,
          });
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as File;
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: item.name,
            size: item.size,
            type: item.type || "file",
            isFolder: false,
            progress: 0,
            status: "pending",
            file: item,
          });
        }
      }

      return newFiles;
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const items = e.dataTransfer.items;
      const filesList: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const entry = (items[i] as any).webkitGetAsEntry?.();
        if (entry) {
          if (entry.isDirectory) {
            const folderFiles = Array.from(e.dataTransfer.files).filter(
              (
                f: File & {
                  webkitRelativePath?: string;
                }
              ) =>
                f.webkitRelativePath &&
                f.webkitRelativePath.startsWith(entry.name)
            );
            const newFiles = processFiles(folderFiles, entry.name);
            setFiles((prev) => [...prev, ...newFiles]);
          } else {
            filesList.push(e.dataTransfer.files[i]);
          }
        }
      }

      if (files.length > 0) {
        const newFiles = processFiles(filesList);
        setFiles((prev) => [...prev, ...newFiles]);
      }

      setShowSettings(true);
    },
    [processFiles]
  );

  const uploadFilesToSupabase = useCallback(
    async (filesToUpload: UploadedFile[]) => {
      setUploading(true);
      for (const fileObj of filesToUpload) {
        if (fileObj.isFolder) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    progress: 100,
                    status: "completed",
                  }
                : f
            )
          );
          continue;
        }
        const realFile = fileObj.file ?? null;
        if (!realFile) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error",
                  }
                : f
            )
          );
          continue;
        }
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? {
                  ...f,
                  status: "uploading",
                }
              : f
          )
        );
        const folderPath = uploadName ? `${uploadName}` : "uploads";
        const filePath = `${folderPath}/${Date.now()}_${realFile.name}}`;
        const { error } = await supabase.storage
          .from("uploads")
          .upload(filePath, realFile, {
            upsert: true,
          });
        if (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error",
                  }
                : f
            )
          );
          continue;
        }
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, progress: 100, status: "completed" }
              : f
          )
        );
        setUploading(false);
        const slug = customSlug || Math.random().toString(36).substring(2, 9);
        await supabase.from("uploads").insert({
          slug,
          email,
          password,
          max_downloads: maxDownloads,
          expiry_hours: expiryTime,
          allow_preview: allowPreview,
          created_at: new Date(),
        });
      }
    },
    [
      uploadName,
      customSlug,
      email,
      password,
      maxDownloads,
      expiryTime,
      allowPreview,
    ]
  );

  return <div onDragOver={handleDragOver} onDragLeave={handleDragLeave}></div>;
}
