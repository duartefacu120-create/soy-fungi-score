import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: 'SoyFungiScore <onboarding@resend.dev>',
            to: email,
            subject: 'Restablecer tu contraseña - SoyFungiScore',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #15803d;">Hola,</h2>
                    <p>Has solicitado restablecer tu contraseña en SoyFungiScore.</p>
                    <p>Haz clic en el siguiente botón para elegir una nueva contraseña:</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">Este enlace expirará en 1 hora.</p>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { error: 'No se pudo enviar el correo de recuperación.' };
    }
}
