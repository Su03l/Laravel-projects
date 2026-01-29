<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    use ApiResponse;

    // إضافة موظف جديد (HR Only)
    public function store(StoreEmployeeRequest $request)
    {
        try {
            // نستخدم الترانزاكشن: يا ننشئ الاثنين يا نكنسل العملية كلها
            $result = DB::transaction(function () use ($request) {

                // 1. إنشاء اليوزر
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => $request->role,
                ]);

                // 2. إنشاء ملف الموظف وربطه باليوزر
                $user->employee()->create([
                    'department_id' => $request->department_id,
                    'job_title' => $request->job_title,
                    'salary' => $request->salary,
                    'joining_date' => $request->joining_date,
                ]);

                return $user->load('employee');
            });

            return $this->success($result, 'تم إضافة الموظف بنجاح', 201);
        } catch (\Exception $e) {
            return $this->error('حدث خطأ أثناء الإضافة: ' . $e->getMessage(), 500);
        }
    }

    // عرض قائمة الموظفين
    public function index()
    {
        // نجيب الموظف مع بيانات اليوزر والقسم
        $employees = Employee::with(['user:id,name,email,role', 'department:id,name'])->paginate(10);
        return $this->success($employees);
    }

    public function show(Employee $employee)
    {
        // نحمل العلاقات عشان نعرض بياناته كاملة
        $employee->load(['user', 'department']);

        return $this->success($employee);
    }

    // تعديل بيانات الموظف (المعقدة)
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        try {
            DB::transaction(function () use ($request, $employee) {

                // 1. تحديث بيانات اليوزر (الاسم، الايميل، الرول)
                $user = $employee->user;

                // نجهز البيانات اللي بنحدثها في جدول اليوزر
                $userData = $request->only(['name', 'email', 'role']);

                // حالة خاصة للباسورد: نحدثه فقط لو المستخدم كتب شي جديد
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->password);
                }

                $user->update($userData);

                // 2. تحديث بيانات الموظف (القسم، الراتب، المسمى)
                // only() تأخذ فقط الحقول الموجودة في الريكويست
                $employee->update($request->only([
                    'department_id',
                    'job_title',
                    'salary',
                    'joining_date'
                ]));
            });

            // نرجع البيانات الجديدة بعد التحديث
            return $this->success($employee->load('user'), 'تم تحديث بيانات الموظف بنجاح');
        } catch (\Exception $e) {
            return $this->error('حدث خطأ أثناء التحديث: ' . $e->getMessage(), 500);
        }
    }

    // حذف موظف
    public function destroy(Employee $employee)
    {
        try {
            DB::transaction(function () use ($employee) {
                // Check if user exists
                if ($employee->user) {
                    // Manually delete related records if not cascading
                    // or just try to delete user and let DB handle/fail
                    // For debugging, we just try delete
                    $employee->user->delete();
                } else {
                    $employee->delete();
                }
            });
            return $this->success(null, 'تم حذف الموظف وكافة بياناته بنجاح');
        } catch (\Exception $e) {
            return $this->error('حدث خطأ أثناء الحذف: ' . $e->getMessage(), 500);
        }
    }
}
