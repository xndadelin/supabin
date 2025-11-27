export interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    progress?: number;
    status?: 'pending' | 'uploading' | 'completed' | 'error'
    file?: File
}

export interface UploadData {
    id: string;
    name: string;
    hasPassword: boolean;
    password?: string;
    expiryTime: string;
    maxDownloads: string;
    files: FileData[];
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface UploadSettings {
    uploadName: string;
    password: string;
    email: string;
    expiryTime: string;
    maxDownloads: string;
    allowPreview: boolean;
    customSlug: string;
}

