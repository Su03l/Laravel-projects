<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Mail\CheckoutReminderMail;
use App\Mail\BookingCompletedMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Enums\BookingStatus;

class SendBookingNotifications extends Command
{
    protected $signature = 'bookings:send-notifications';
    protected $description = 'Send checkout reminders and completion emails';

    public function handle()
    {
        $this->info('Starting booking notifications check... ');

        // 1. Checkout Reminder (Tomorrow)
        $tomorrowCheckouts = Booking::whereDate('check_out', Carbon::tomorrow())
            ->where('status', BookingStatus::CONFIRMED)
            ->where('reminder_email_sent', false)
            ->get();

        foreach ($tomorrowCheckouts as $booking) {
            Mail::to($booking->user->email)->send(new CheckoutReminderMail($booking));

            $booking->update(['reminder_email_sent' => true]);
            $this->info("Reminder sent to booking #{$booking->id}");
        }

        // 2. Thank You Email (Yesterday)
        $yesterdayCheckouts = Booking::whereDate('check_out', Carbon::yesterday())
            ->whereIn('status', [BookingStatus::CONFIRMED, BookingStatus::COMPLETED])
            ->where('completed_email_sent', false)
            ->get();

        foreach ($yesterdayCheckouts as $booking) {
            if ($booking->status !== BookingStatus::COMPLETED) {
                $booking->update(['status' => BookingStatus::COMPLETED]);
            }

            Mail::to($booking->user->email)->send(new BookingCompletedMail($booking));

            $booking->update(['completed_email_sent' => true]);
            $this->info("Thank you email sent to booking #{$booking->id}");
        }

        $this->info('All notifications processed successfully! ');
    }
}
