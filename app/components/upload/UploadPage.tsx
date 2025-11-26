import { useCallback, useState } from "react";

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    isFolder: boolean;
    progress: number;
    status: 'pending' | 'uploading' | 'completed';
    fileCount?: number;
}

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [uploading, setUploading] = useState<boolean>(false)
    const [uploadName, setUploadName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [expiryTime, setExpiryTime] = useState<string>('')
    const [maxDownloads, setMaxDownloads] = useState('unlimited')
    const [allowPreview, setAllowPreview] = useState<boolean>(true)
    const [shareLink, setShareLink] = useState<string>('')
    const [customSlug, setCustomSlug] = useState<string>('')
    const [showSettings, setShowSettings] = useState<boolean>(false)

    const processFiles = useCallback((items: FileList | File[] , folderName: string | null = null): UploadedFile[] => {
        const newFiles: UploadedFile[] = [];
        let totalSize = 0;
        let fileCount = 0;

        for(let i = 0; i < items.length; i++) {
            const item = items[i]
            if(item?.type || item?.size) {
                totalSize  = totalSize + item.size
                fileCount++;
            }
        }

        if(folderName) {
            newFiles.push({
                id: Math.random().toString(36).substring(2, 9),
                name: folderName,
                size: totalSize,
                type: 'folder',
                isFolder: true, 
                fileCount,
                progress: 0,
                status: 'pending'
            })
        } else {
            for(let i = 0; i < items.length; i++) {
                const item = items[i];
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


    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false)

        const items = e.dataTransfer.items;
        const filesList: File[] = []

        for(let i = 0; i < items.length; i++) {
            const entry = (items[i] as any).webkitGetAsEntry?.();
            if (entry) {
                if(entry.isDirectory) {
                    const folderFiles = Array.from(e.dataTransfer.files).filter(
                        (f: File & {
                            webkitRelativePath?: string 
                        }) =>
                            f.webkitRelativePath && f.webkitRelativePath.startsWith(entry.name)
                    )
                    const newFiles = processFiles(folderFiles, entry.name)
                    setFiles((prev) => [
                        ...prev, ...newFiles
                    ])
                } else {
                    filesList.push(e.dataTransfer.files[i])
                }
                
            }
        }

        if (files.length > 0) {
            const newFiles = processFiles(filesList);
            setFiles((prev) => [...prev, ...newFiles])
        }

        setShowSettings(true)
    }, [processFiles])

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >

        </div>
    )

}