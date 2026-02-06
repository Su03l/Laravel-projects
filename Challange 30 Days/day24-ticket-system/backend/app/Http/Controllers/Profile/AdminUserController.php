<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /**
     * 1. قائمة المستخدمين (للوحة تحكم الأدمن)
     * مع فلتر بحث بسيط
     */
    public function index(Request $request)
    {
        $query = User::query();

        // بحث بالاسم أو الإيميل
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // فلتر حسب الدور (هات لي بس العملاء، أو بس الموظفين)
        if ($request->has('role')) {
            $query->role($request->role);
        }

        $users = $query->with('roles')->latest()->paginate(20);

        return response()->json($users);
    }

    /**
     * 2. الحظر / إلغاء الحظر (Toggle Ban)
     * إذا كان نشط يحظره، وإذا محظور يفعله
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // ممنوع تحظر نفسك أو تحظر أدمن آخر (حماية)
        if ($user->id === auth()->id() || $user->hasRole('Admin')) {
            return response()->json([
                'message' => 'لا يمكن اتخاذ هذا الإجراء ضد هذا المستخدم'
            ], 403);
        }

        // عكس الحالة
        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'تفعيل' : 'حظر';

        return response()->json([
            'message' => "تم {$status} المستخدم بنجاح",
            'is_active' => $user->is_active
        ]);
    }

    public function storeAgent(Request $request)
    {
        // 1. التحقق من البيانات
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|confirmed|min:8', // لازم تأكيد الباسورد
            'phone' => 'nullable|string|max:20',
        ]);

        // 2. إنشاء المستخدم
        $agent = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'is_active' => true,
        ]);

        // 3. أهم خطوة: نعطيه دور "موظف" فوراً
        $agent->assignRole('Agent');

        return response()->json([
            'message' => 'تم إنشاء حساب الموظف بنجاح',
            'agent' => $agent
        ], 201);
    }
}
