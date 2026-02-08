<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $name) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'مرحباً بك في عائلة StayEase');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.welcome');
    }

    public function attachments(): array
    {
        return [];
    }
}
