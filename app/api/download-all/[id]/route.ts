import { createClient } from "@/app/utils/supabase/server";
import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const params = 'then' in context.params ? await context.params : context.params;
        const { id } = params;
        const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'

        const { data: uploadData, error: uploadError } = await supabase
            .from('uploads')
            .select('*')
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

        const { data: files, error: filesError } = await supabase
            .from('files')
            .select('*')
            .eq('upload_id', uploadData.id)

        if(filesError) {
            return NextResponse.json(
                { error: 'file not found' },
                { status: 404 }
            )
        }

        const zip = new JSZip();

        for (const file of files) {
            const { data: fileResponse, error: downloadError } = await supabase.storage
                .from('uploads')
                .download(file.storage_path);

            if (!downloadError && fileResponse) {
                const arrayBuffer = await fileResponse.arrayBuffer();
                zip.file(file.name, arrayBuffer);
            }
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' }); 

        for(const file of files) [
            await supabase
                .from('downloads_logs')
                .insert({
                    upload_id: uploadData.id,
                    file_id: file.id,
                    ip_address: ipAddress,
                    user_agent: userAgent
                })
        ]

        await supabase
            .from('uploads')
            .update({
                download_count: uploadData.download_count + 1
            })
            .eq('id', uploadData.id)

        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="files.zip"`,
            },
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: 'download all failed'
        }, {
            status: 500
        })
    }
}