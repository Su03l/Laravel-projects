<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    // نستقبل الكود عشان نعرضه في الرسالة
    public function __construct(
        public string $otpCode
    )
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: ' رمز التحقق الخاص بك (AuthMaster)',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp', // اسم ملف التصميم اللي بنسويه تحت
        );
    }
}
