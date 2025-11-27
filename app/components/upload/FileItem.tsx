import { File, FolderOpen, X, Check, Download, Folder } from 'lucide-react'

interface FileItemProps {
    file: {
        id: string;
        name: string;
        size: number;
        type: string;
        isFolder: boolean;
        progress: number;
        status: "pending" | "uploading" | "completed" | "error";
        fileCount?: number;
        file?: File;
    };
    onRemove?: (id: string) => void;
    viewMode?: boolean;
}

export default function FileItem(
    { file, onRemove, viewMode = false }: FileItemProps
) {
    const getBgColor = () => {
        if (file.isFolder) return 'bg-[#fffaeb]'
        if (file.type.startsWith('image/')) return 'bg-[#fce7f3]'
        if (file.type.includes('pdf')) return 'bg-[#fee2e2]'
        return 'bg-[#dbeafe]'
    }

    const getFileTextColor = () => {
        if (file.isFolder) return 'text-[#ca8a04]'
        if (file.type.startsWith('image/')) return 'text-[#be185d]'
        if (file.type.includes('pdf')) return 'text-[#dc2626]'
        return 'text-[#0284c7]'
    }

    const getFileIcon = () => {
        if (file.isFolder) return <FolderOpen className={`w-4 h-4 ${getFileTextColor()}`} />
        if (file.type.startsWith('image/')) return <File className={`w-4 h-4 ${getFileTextColor()}`} />
        if (file.type.includes('pdf')) return <File className={`w-4 h-4 ${getFileTextColor()}`} />
        return <File className={`w-4 h-4 ${getFileTextColor()}`} />
    }

    const formatSize = (bytes: number): string => {
        if(bytes === 0) return '0 Bytes'
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className={`p-3 transition-colors ${viewMode ? 'hover:bg-[#0f172a]' : 'hover:bg-[#0f172a]'}`}>
            <div className='flex items-center gap-3'>
                <div className={`p-2 rounded-lg ${getBgColor()}`}>
                    {getFileIcon()}
                </div>

                <div className='flex-1 min-w-0'>
                    <p className='font-medium text-[#f1f5f9] truncate text-sm'>
                        {file.name}
                        {file.isFolder && file.fileCount && (
                            <span className='text-[#cbd5e1] text-xs ml-1'>
                                ({file.fileCount} files)
                            </span>
                        )}
                    </p>
                    <p className='text-xs text-[#cbd5e1]'>
                        {formatSize(file.size)}
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    {!viewMode && (
                        <>
                            {file.status === 'completed' ? (
                                <div className='flex items-center gap-1 text-[#3ecf8e]'>
                                    <div className='p-0.5 bg-[#d3f9d8] rounded-full'>
                                        <Check className='w-4 h-4' />
                                    </div>
                                </div>
                            ):  file.status === 'uploading' && file.progress !== undefined ? (
                                <div className='flex items-center gap-2'>
                                    <div className='w-24 h-1.5 bg-[#dee2e6] rounded-full overflow-hidden'>
                                        <div style={{
                                            width: `${file.progress}`
                                        }} className='h-full bg-[#3ecf8e] transition-all duration-300 rounded-full' />
                                    </div>
                                </div>
                            ): null} 

                            {onRemove && (
                                <button
                                    onClick={() => onRemove(file.id)}
                                    className='p-1.5 hover:bg-[#dc2626]/20 rounded-lg transition-colors'
                                >
                                    <X className='w-4 h-4 text-[#64748b] hover:text-[#ff6b6b]' />
                                </button>
                            )}

                            {viewMode && (
                                <button className='px-3 py-1.5 bg-[#3ecf8e] text-[#0f172a] rounded-lg hover:bg-[#249361] transition-colors flex items-center gap-1.5 text-xs font-medium'>
                                    <Download className='w-3.5 h-3.5' />
                                    Download
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}