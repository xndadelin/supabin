'use client';
import { useCallback, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import EmptyState from "./EmptyState";
import FilesList from "./FilesList";
import SettingsPanel from "./SettingsPanel";

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
  const [showSettings, setShowSettings] = useState<boolean>(true);
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

      if (filesList.length > 0) {
        const newFiles = processFiles(filesList);
        setFiles((prev) => [...prev, ...newFiles]);
      }

      setShowSettings(true);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return;
    const items = e.target.files;
    const folderName = (items[0] as any).webkitRelativePath.split("/")[0]
    const newFiles = processFiles(items, folderName)
    setFiles(prev => [
        ...prev, 
        ...newFiles
    ])
    // uploadFilesToSupabase(newFiles)
  }, [processFiles])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if(files.length === 1) {
        setShowSettings(false);
        setShareLink("");
    }
  }, [files.length])

  console.log(files)

  const allCompleted = files.length >.0 && files.every(f => f.status === 'completed')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`fixed inset-0 transition-all duration-300 ${
      isDragging ? 'bg-[#1e293b]' : 'bg-[#0f172a]'
    }`}>
      <div className="min-h-screen flex items-center justify-center p-4 overflow-y-auto">
        {files.length === 0 ? (
          <EmptyState
            isDragging={isDragging}
            onFileSelect={handleFileSelect}
          />
        ): (
          <div className="w-full max-w-2xl space-y-4">
            <FilesList
              files={files}
              onRemove={removeFile}
              onAddMore={handleFileSelect}
              viewMode={true}
            />

            {showSettings && (
              <SettingsPanel
                uploadName={uploadName}
                setUploadName={setUploadName}
                password={password}
                setPassword={setPassword}
                email={email}
                setEmail={setEmail}
                expiryTime={expiryTime}
                setExpiryTime={setExpiryTime}
                maxDownloads={maxDownloads}
                setMaxDownloads={setMaxDownloads}
                allowPreview={allowPreview}
                setAllowPreview={setAllowPreview}
                shareLink={shareLink}
                customSlug={customSlug}
                setCustomSlug={setCustomSlug}
                allCompleted={allCompleted}
                onCopy={copyToClipboard}
              />
            )}

          </div>
        )}
      </div>

      {isDragging && (
        <div className="fixed inset-0 border-2 border-dashed border-[#3ecf8e] pointer-events-none rounded-2xl m-2"></div>
      )}
    </div>
  )
}
