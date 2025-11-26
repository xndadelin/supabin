import { useCallback, useState } from "react";

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [files, setFiles] = useState([])
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


    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >

        </div>
    )

}