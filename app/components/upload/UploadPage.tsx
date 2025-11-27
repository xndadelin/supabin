'use client';
import React, { useCallback, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import EmptyState from "./EmptyState";
import FilesList from "./FilesList";
import SettingsPanel from "./SettingsPanel";

interface FileData {
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
  const [files, setFiles] = useState<FileData[]>([]);
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

  const processFiles = useCallback((items: FileList): FileData[] => {
      const newFiles: FileData[] = []
      for(let i = 0; i < items.length; i++) {
        const item = items[i];

        if(item.size > 0) {
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: item.name,
            size: item.size,
            type: item.type || 'file',
            isFolder: false,
            progress: 0,
            status: 'pending'
          })
        }
      }

      return newFiles;
  }, [])

  const simulateUpload = useCallback((filesToUpload: FileData[]) => {
    setUploading(true);

    filesToUpload.forEach((file) => {
      const interval = setInterval(() => {
        setFiles(prev => 
          prev.map(f => {
            if(f.id === file.id && f.progress < 100) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "completed" : "uploading"
              }
            }
            return f
          })
        )
      }, 300)

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
          )
        )
      }, 2000)
    })

    setTimeout(() => {
      setUploading(false)
      const randomId = Math.random().toString(36).substring(2, 9);
      setShareLink(window.location.origin + `/${randomId}`)
    }, 2500);
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length === 0) return;

    const newFiles = processFiles(droppedFiles)
    setFiles(prev => [...prev, ...newFiles])
    simulateUpload(newFiles)

    setShowSettings(true)

  }, [processFiles, simulateUpload]) 

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
