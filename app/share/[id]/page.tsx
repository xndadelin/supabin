'use client'

import { useEffect, useState } from "react";
import DownloadPage from "@/app/components/upload/download/DownloadPage";
import { getUploadData } from "@/app/lib/api";
import { useParams } from "next/navigation";
import { UploadData } from "@/app/types";

export default function SharePage(){
    const { id } = useParams()
    const [uploadData, setUploadData] = useState<UploadData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUploadData(id as string)
                setUploadData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load')
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchData()
    }, [id])

    if (loading) return <div className="flex items-center justify-center h-screen text-[#f1f5f9]">Loading...</div>
    if (error) return <div className="flex items-center justify-center h-screen text-red-400">{error}</div>
    if (!uploadData) return <div className="flex items-center justify-center h-screen text-[#f1f5f9]">Not found</div>

    return <DownloadPage uploadData={uploadData} />
}