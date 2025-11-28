import { FileData, UploadSettings, UploadData } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function uploadFiles(
    files: File[],
    settings: UploadSettings
) : Promise<{shareId: string; shareLink: string}> {
    const formData = new FormData();

    files.forEach(file => {
        formData.append('files', file)
    })

    formData.append('settings', JSON.stringify(settings))

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
    })

    if(!response.ok) {
        throw new Error('Upload failed')
    }

    return response.json()
}

export async function getUploadData(id: string): Promise<UploadData>{
    const response = await fetch(`${API_URL}/share/${id}`)

    if(!response.ok) {
        console.log(response)
        throw new Error('Failed to fetch upload data')
    }

    return response.json();
}

export async function downloadAllFiles(id: string): Promise<Blob> {
    const response = await fetch(`${API_URL}/download-all/${id}/`)

    if(!response.ok) {
        throw new Error('Download all failed')
    }

    return response.blob()
}

export async function verifyPassword(
    id: string,
    password: string
): Promise<boolean> {
    const response = await fetch(`${API_URL}/verify/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password
        })
    })

    if(!response.ok) {
        return false
    }

    const data = await response.json();
    return data.valid;
}

