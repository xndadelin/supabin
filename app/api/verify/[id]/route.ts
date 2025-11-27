import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"

export async function POST(
    request: NextRequest,
    { params } : { params: { id: string } }
) {
    const supabase = await createClient()
    try {
        const { id } = params;
        const { password } = await request.json();

        const { data: uploadData, error: uploadError } = await supabase
            .from('uploads')
            .select('password_hash')
            .or(`id.eq.${id},custom_slug.eq.${id}`)
            .single()
        
        if(uploadError) {
            return NextResponse.json(
                { error: 'upload not found' },
                { status: 404 }
            )
        }

        if(!uploadData.password_hash) {
            return NextResponse.json({
                valid: true
            })
        }

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

        const valid = passwordHash === uploadData.password_hash

        return NextResponse.json({
            valid
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: 'verification failed',
        }, {
            status: 500
        })
    }
}