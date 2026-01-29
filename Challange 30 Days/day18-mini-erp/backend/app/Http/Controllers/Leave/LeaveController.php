<?php

namespace App\Http\Controllers\Leave;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    use ApiResponse;

    // الموظف: تقديم طلب إجازة
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:annual,sick,unpaid,emergency',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        // نربط الطلب بالموظف الحالي
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'pending';

        $leave = Leave::create($data);
        return $this->success($leave, 'تم تقديم طلب الإجازة بنجاح', 201);
    }

    // HR: تغيير حالة الطلب (موافقة/رفض)
    public function updateStatus(Request $request, Leave $leave)
    {
        // تحقق: لازم اللي يسوي هذا الآكشن يكون HR (عن طريق Middleware لاحقاً)

        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected'
        ]);

        $leave->update($data);

        // (مستقبلاً: هنا نرسل إيميل للموظف بحالة الطلب)

        return $this->success($leave, 'تم تحديث حالة الطلب');
    }

    // الموظف: يشوف طلباته
    public function myLeaves(Request $request)
    {
        return $this->success($request->user()->leaves()->get());
    }
}
