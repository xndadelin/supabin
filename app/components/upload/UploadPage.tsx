'use client';
import React, { useCallback, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import EmptyState from "./EmptyState";
import FilesList from "./FilesList";
import SettingsPanel from "./SettingsPanel";
import { uploadFiles } from "@/app/lib/api";
import { FileData } from "@/app/types";

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
  const [error, setError] = useState('')

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
            progress: 0,
            status: 'pending',
            file: item
          })
        }
      }

      return newFiles;
  }, [])

  const simulateUpload = useCallback(async(filesToUpload: FileData[]) => {
    try {
      setUploading(true);
      setError("")

      setFiles(prev => 
        prev.map(f => {
          if(filesToUpload.some(u => u.id === f.id)) {
            return {
              ...f,
              status: 'uploading',
              progress: 10
            }
          }
          return f;
        })
      )

      const filesToSend = filesToUpload
        .map(f => f.file)
        .filter((f): f is File => f !== undefined)

      const { shareId, shareLink } = await uploadFiles(filesToSend, {
        uploadName,
        password,
        email,
        expiryTime,
        maxDownloads,
        allowPreview,
        customSlug
      })

      setFiles(prev => 
        prev.map(f => {
          if(filesToUpload.some(u => u.id === f.id)) {
            return {
              ...f,
              progress: 100,
              status: 'completed'
            }
          }
          return f
        })
      )

      setShareLink(shareLink)
      setUploading(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
      setUploading(false)

      setFiles(prev => 
        prev.map(f => {
          if(filesToUpload.some(u => u.id === f.id)) {
            return {
              ...f,
              status: 'error'
            }
          }
          return f
        })
      )
    } 
  }, [uploadName, password, email, expiryTime, maxDownloads, allowPreview, customSlug])

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

  const handleFilesSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return;
    
    const newFiles = processFiles(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
    simulateUpload(newFiles)

    setShowSettings(true)

  }, [processFiles, simulateUpload])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      if (filtered.length == 0) {
        setShowSettings(false)
        setShareLink("")
      }
      return filtered;
    })
  }, [])

  const allCompleted = files.length >.0 && files.every(f => f.status === 'completed')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
  }

  console.log(files)

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`fixed inset-0 transition-all overflow-y-auto duration-300 ${
      isDragging ? 'bg-[#1e293b]' : 'bg-[#0f172a]'
    }`}>
      <div className="min-h-screen flex items-center justify-center p-4 overflow-y-auto">
        {files.length === 0 ? (
          <EmptyState
            isDragging={isDragging}
            onFileSelect={handleFilesSelect}
          />
        ): (
          <div className="w-full max-w-2xl space-y-4">

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <FilesList
              files={files}
              onRemove={removeFile}
              onAddMore={handleFilesSelect}
              viewMode={false}
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
                files={files}
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
