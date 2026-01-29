<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use ApiResponse;

    // تسجيل الدخول (Check In)
    public function checkIn(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        // 1. هل سجل دخول اليوم من قبل؟
        $existing = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return $this->error('لقد قمت بتسجيل الدخول مسبقاً لهذا اليوم', 400);
        }

        // 2. تسجيل الدخول
        $attendance = Attendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'check_in' => Carbon::now()->toTimeString(),
            'status' => 'present' // ممكن نحسب لو جاء متأخر عن 9 الصباح نخليه late
        ]);

        return $this->success($attendance, 'تم تسجيل الدخول ');
    }

    // تسجيل الخروج (Check Out)
    public function checkOut(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        // 1. ندور سجله حق اليوم
        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return $this->error('لم تقم بتسجيل الدخول اليوم!', 400);
        }

        if ($attendance->check_out) {
            return $this->error('لقد قمت بتسجيل الخروج مسبقاً', 400);
        }

        // 2. حساب ساعات العمل
        $checkIn = Carbon::parse($attendance->check_in);
        $checkOut = Carbon::now();
        $hours = $checkOut->diffInHours($checkIn); // الفرق بالساعات

        // 3. التحديث
        $attendance->update([
            'check_out' => $checkOut->toTimeString(),
            'work_hours' => $hours
        ]);

        return $this->success($attendance, 'تم تسجيل الخروج، يعطيك العافية ');
    }
    // عرض سجلات الحضور
    public function index(Request $request)
    {
        // ممكن نضيف فلاتر بالتاريخ أو الموظف
        $query = Attendance::with('user:id,name');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        $attendance = $query->latest()->paginate(10);
        return $this->success($attendance);
    }

    // تحديث سجل حضور (للأدمن)
    public function update(Request $request, Attendance $attendance)
    {
        $data = $request->validate([
            'check_in' => 'sometimes|date_format:H:i:s',
            'check_out' => 'sometimes|date_format:H:i:s',
            'status' => 'sometimes|in:present,absent,late,excused',
        ]);

        if (isset($data['check_in']) && isset($data['check_out'])) {
            $start = Carbon::parse($data['check_in']);
            $end = Carbon::parse($data['check_out']);
            $data['work_hours'] = $end->diffInHours($start);
        }

        $attendance->update($data);
        return $this->success($attendance, 'تم تحديث السجل بنجاح');
    }

    // حذف سجل حضور
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return $this->success(null, 'تم حذف السجل بنجاح');
    }
}
