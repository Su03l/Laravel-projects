<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'تفعيل حسابك في StayEase');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verification');
    }

    public function attachments(): array
    {
        return [];
    }
}
