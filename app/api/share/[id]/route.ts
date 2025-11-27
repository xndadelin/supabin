import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    try {
        const { id } = params;

        let {
            data: uploadData, 
            error: uploadError
        } = await supabase
            .from('uploads')
            .select('*')
            .or(`id.eq.${id},custom_slug.eq.${id}`)
            .single()
        
        if(uploadError) {
            return NextResponse.json(
                { error: 'upload not found' },
                { status: 404 }
            )
        }

        if(uploadData.expiry_date && new Date(uploadData.expiry_date) < new Date()) {
            return NextResponse.json(
                { error: 'upload has expired' },
                { status: 410 }
            )
        }

        if(uploadData.max_downloads && uploadData.download_count >= uploadData.max_downloads) {
            return NextResponse.json(
                { error: 'download limit reached' },
                { status: 410 }
            )
        }

        const { data: files, error: filesError } = await supabase
            .from('files')
            .select('id, name, size, type, created_at')
            .eq('upload_id', uploadData.id)
        
        if (filesError) throw filesError;

        return NextResponse.json({
            id: uploadData.id,
            name: uploadData.name,
            requiresPassword: !!uploadData.password_hash,
            allowPreview: uploadData.allow_preview,
            files: files || [],
            expiryDate: uploadData.expiry_date,
            maxDownloads: uploadData.download_count,
            createdAt: uploadData.created_at
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'failed to fetch share' },
            { status: 500 }
        )
    }
}