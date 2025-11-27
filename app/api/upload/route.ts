import { createClient } from "@/app/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'
export async function POST(request: NextRequest) {
    const supabase = await createClient()

    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const settings = JSON.parse(formData.get('settings') as string)

        let passwordHash = null;
        if(settings.password) {
            passwordHash = crypto.createHash('sha256').update(settings.password).digest('hex')
        }

        const { data: uploadData, error: uploadError } = await supabase
            .from('uploads')
            .insert({
                name: settings.uploadName,
                password_hash: passwordHash,
                expiry_data: settings.expiryTime ? new Date(settings.expiryTime).toISOString() : null,
                max_downloads: settings.maxDownloads === 'unlimited' ? null : parseInt(settings.maxDownloads),
                allow_preview: settings.allowPreview, 
                custom_slug: settings.customSlug || null,
            })
            .select()
            .single();

        if (uploadError) throw uploadError

        const uploadId = uploadData.id
        const fileRecords = [];

        for(const file of files) {
            const fileBuffer = await file.arrayBuffer();
            const fileName = `${uploadId}/${Date.now()}-${file.name}`

            const { error: storageError } = await supabase.storage
                .from('uploads')
                .upload(fileName, fileBuffer, {
                    contentType: file.type
                })

            if (storageError) throw storageError

            const { data: fileData, error: fileError } = await supabase
                .from('files')
                .insert({
                    upload_id: uploadId,
                    name: file.name,
                    size: file.size,
                    type: file.type || 'application/octet-stream',
                    storage_path: fileName
                })
                .select()
                .single()

            if (fileError) throw fileError;
            fileRecords.push(fileData)    
        }

        const shareLink = settings.customSlug
            ? `${process.env.NEXT_PUBLIC_APP_URL}/${settings.customSlug}`
            : `${process.env.NEXT_PUBLIC_APP_URL}/${uploadId}`

        return NextResponse.json({
            shareId: uploadId,
            shareLink
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'upload failed' },
            { status: 500 }
        )
    }
}