<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'طلب استعادة كلمة المرور');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.reset_password');
    }

    public function attachments(): array
    {
        return [];
    }
}
