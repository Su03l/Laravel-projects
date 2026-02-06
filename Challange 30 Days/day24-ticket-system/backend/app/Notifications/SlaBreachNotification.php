<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SlaBreachNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(' تنبيه خطير: تجاوز وقت SLA للتذكرة #' . $this->ticket->ref_id)
            ->line('التذكرة بعنوان: ' . $this->ticket->title)
            ->line('قد تجاوزت الوقت المسموح للحل!')
            ->action('عرض التذكرة', url('/tickets/' . $this->ticket->uuid))
            ->line('يرجى التصرف فوراً.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ref_id' => $this->ticket->ref_id,
            'message' => 'تجاوزت التذكرة وقت SLA المحدد!',
            'type' => 'sla_breach'
        ];
    }
}
