import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    try {
        const { to, link, uploadName, password } = await req.json();

        const subject = `Files shared: ${uploadName}`
        const text = `You have received files via Supabin.
        
Download link: ${link}
${password ? `Password: ${password}` : ''}
`
        const html = `<p>You have received files via Supabin.</p>
<p><strong>Download link:</strong> <a href="${link}">${link}</a></p>
${password ? `<p><strong>Password:</strong> ${password}</p>` : ''}
`


        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html
        })

        return Response.json({
            ok: true
        })

    } catch (error) {
        console.error('error sending email:', error);
        return Response.json({
            error: 'Failed to send email'
        }, {
            status: 500
        })
    }
}