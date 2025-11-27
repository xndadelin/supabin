import DownloadPage from "@/app/components/upload/download/DownloadPage";
import { getUploadData } from "@/app/lib/api";

export default async function SharePage({params}: {
    params: {
        id: string
    }
}) {
    const uploadData = await getUploadData(params.id)
    return <DownloadPage uploadData={uploadData} />
}