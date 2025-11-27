import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params } : { params: { id: string, fileId: string } }
) {
    try {
        const supabase = await createClient()
        const { id, fileId } = params;
        const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'

        const { data: uploadData, error: uploadError } = await supabase
            .from('uploads')
            .select('id, password_hash, max_downloads, download_count, expiry_date')
            .or(`id.eq.${id},custom_slug.eq.${id}`)
            .single()
        
        if (uploadError) {
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

        const { data: fileData, error: fileError } = await supabase
            .from('files')
            .select('*')
            .eq('id', fileId)
            .eq('upload_id', uploadData.id)
            .single()

        if(fileError) {
            return NextResponse.json(
                { error: 'file not found' },
                { status: 404 }
            )
        }

        const { data: fileBuffer, error: downloadError } = await supabase.storage
            .from('uploads')
            .download(fileData.storage_path)

        if (downloadError) throw downloadError;

        await supabase
            .from('download_logs')
            .insert({
                upload_id: uploadData.id,
                file_id: fileId,
                ip_address: ipAddress,
                user_agent: userAgent
            })
        
        await supabase
            .from('uploads')
            .update({
                download_count: uploadData.download_count + 1
            })
            .eq('id', uploadData.id)

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': fileData.type,
                'Content-Disposition': `attachment; filename="${fileData.name}"`
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: 'download failed'
        }, {
            status: 500
        })
    }
}