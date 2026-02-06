<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\SlaBreachNotification;

class CheckSlaBreaches extends Command
{
    // اسم الأمر الذي سنكتبه في التيرمنال
    protected $signature = 'nexus:check-sla';
    protected $description = 'فحص التذاكر المتأخرة وإرسال تنبيهات';

    public function handle()
    {
        $this->info('بدء فحص التذاكر...');

        // 1. البحث عن التذاكر المتأخرة
        // الشروط: مفتوحة (ليست مغلقة) + وقت SLA صار في الماضي + لم يتم التنبيه عنها مسبقاً (لتجنب التكرار)
        // ملاحظة: لتجنب التكرار، سنعتمد في هذا المثال البسيط على عدم وجود حقل "is_overdue".
        // في المشاريع الكبيرة نضيف عمود boolean is_overdue للداتابيس.

        $overdueTickets = Ticket::where('status', '!=', 'closed')
            ->where('status', '!=', 'resolved') // ولا محلولة
            ->where('sla_due_at', '<', now()) // الوقت فات
            // ->where('is_overdue', false) // لو كنا أضفنا العمود
            ->get();

        if ($overdueTickets->isEmpty()) {
            $this->info('لا توجد تذاكر متأخرة. النظام سليم ');
            return;
        }

        // 2. جلب الأدمن لتبليغه
        $admins = User::role('Admin')->get();

        foreach ($overdueTickets as $ticket) {
            $this->error("تذكرة متأخرة وجدت: {$ticket->ref_id}");

            // إرسال تنبيه للأدمنز
            // نستخدم Notification::send لإرسال لمجموعة
            \Illuminate\Support\Facades\Notification::send($admins, new SlaBreachNotification($ticket));

            // (اختياري) تحديث التذكرة لوسمها بأنها متأخرة
            // $ticket->update(['is_overdue' => true]);

            // (اختياري) رفع الأولوية أوتوماتيكياً للأعلى!
            $ticket->update(['priority' => 'critical']);
        }

        $this->info("تم فحص ومعالجة " . $overdueTickets->count() . " تذكرة.");
    }
}
