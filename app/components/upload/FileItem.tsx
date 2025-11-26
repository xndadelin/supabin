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
        if (file.isFolder) return 'bg-yellow-100'
        if (file.type.startsWith('image/')) return 'bg-pink-100'
        if (file.type.includes('pdf')) return 'bg-red-100'
        return 'bg-blue-100'
    }

    const getFileIcon = () => {
        if (file.isFolder) return <FolderOpen className='w-6 h-6 text-yellow-600' />
        if (file.type.startsWith('image/')) return <File className='w-6 h-6 text-pink-600' />
        if (file.type.includes('pdf')) return <File className='w-6 h-6 text-red-600' />
        return <File className='w-6 h-6 text-blue-600' />
    }

    const formatSize = (bytes: number): string => {
        if(bytes === 0) return '0 Bytes'
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className={`p-5 transition-colors ${viewMode ? 'hover:bg-blue-50' : 'hover:bg-slate-50'}`}>
            <div className='flex items-center gap-4'>
                <div className={`p-3 rounded-xl ${getBgColor()}`}>
                    {getFileIcon()}
                </div>

                <div className='flex-1 min-w-0'>
                    <p className='font-medium text-slate-800 truncate'>
                        {file.name}
                        {file.isFolder && file.fileCount && (
                            <span className='text-slate-500 text-sm ml-2'>
                                ({file.fileCount} files)
                            </span>
                        )}
                    </p>
                    <p className='text-sm text-slate-500'>
                        {formatSize(file.size)}
                    </p>
                </div>

                <div className='flex items-center gap-4'>
                    {!viewMode && (
                        <>
                            {file.status === 'completed' ? (
                                <div className='flex items-center gap-2 text-green-600'>
                                    <div className='p-1 bg-green-100 rounded-full'>
                                        <Check className='w-5 h-5' />
                                    </div>
                                </div>
                            ):  file.status === 'uploading' && file.progress !== undefined ? (
                                <div className='flex items-center gap-3'>
                                    <div className='w-32 h-2 bg-slate-200 rounded-full overflow-hidden'>
                                        <div style={{
                                            width: `${file.progress}`
                                        }} className='h-full bg-blue-500 transition-all duration-300 rounded-full' />
                                    </div>
                                </div>
                            ): null} 

                            {onRemove && (
                                <button
                                    onClick={() => onRemove(file.id)}
                                    className='p-2 hover:bg-red-50 rounded-xl transition-colors'
                                >
                                    <X className='w-5 h-5 text-slate-400 hover:text-red-500' />
                                </button>
                            )}

                            {viewMode && (
                                <button className='px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-medium'>
                                    <Download className='w-4 h-4' />
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