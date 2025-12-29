<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\FilterEmployeeRequest;
use Illuminate\Http\Request;

/**
 * @group إدارة الموظفين
 *
 * واجهات برمجة التطبيقات لإدارة الموظفين وتوليد التقارير الخاصة بهم.
 */
class EmployeeController extends Controller
{
    /**
     * عرض قائمة الموظفين
     *
     * الحصول على قائمة مرقمة (Paginated) للموظفين مع إمكانية التصفية.
     *
     * @queryParam name string البحث باسم الموظف. مثال: أحمد
     * @queryParam department string التصفية حسب القسم. مثال: تقنية المعلومات
     * @queryParam position string التصفية حسب المسمى الوظيفي. مثال: مطور برمجيات
     * @queryParam salary_min number الحد الأدنى للراتب. مثال: 5000
     * @queryParam salary_max number الحد الأعلى للراتب. مثال: 15000
     * @queryParam joined_from date تاريخ البداية (Y-m-d). مثال: 2023-01-01
     * @queryParam joined_to date تاريخ النهاية (Y-m-d). مثال: 2023-12-31
     */
    public function index(FilterEmployeeRequest $request)
    {
        $employees = Employee::latest()
            ->filter($request->validated())
            ->paginate(10);

        return response()->json($employees);
    }

    /**
     * إضافة موظف جديد
     *
     * تسجيل موظف جديد في النظام.
     *
     * @bodyParam name string required اسم الموظف. مثال: محمد علي
     * @bodyParam email string required البريد الإلكتروني (يجب أن يكون فريداً). مثال: mohammed@example.com
     * @bodyParam department string required اسم القسم. مثال: الهندسة
     * @bodyParam position string required المسمى الوظيفي. مثال: مطور أول
     * @bodyParam salary number required الراتب الشهري. مثال: 8500.50
     * @bodyParam joined_at date required تاريخ الانضمام (Y-m-d). مثال: 2024-01-15
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'department' => 'required|string',
            'position' => 'required|string',
            'salary' => 'required|numeric|min:0',
            'joined_at' => 'required|date',
        ]);

        $employee = Employee::create($fields);

        return response()->json([
            'message' => 'تم تسجيل الموظف بنجاح ',
            'data' => $employee
        ], 201);
    }

    /**
     * عرض تفاصيل موظف
     *
     * الحصول على البيانات التفصيلية لموظف معين باستخدام المعرف الخاص به.
     *
     * @urlParam employee integer required معرف الموظف (ID). مثال: 1
     */
    public function show(Employee $employee)
    {
        return response()->json($employee);
    }

    /**
     * تحديث بيانات موظف
     *
     * تعديل بيانات موظف موجود مسبقاً في النظام.
     *
     * @urlParam employee integer required معرف الموظف (ID). مثال: 1
     * @bodyParam name string اسم الموظف المحدث. مثال: محمد علي المحدث
     * @bodyParam email string البريد الإلكتروني الجديد. مثال: mohammed.new@example.com
     */
    public function update(Request $request, Employee $employee)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:employees,email,' . $employee->id,
            'department' => 'sometimes|string',
            'position' => 'sometimes|string',
            'salary' => 'sometimes|numeric|min:0',
            'joined_at' => 'sometimes|date',
        ]);

        $employee->update($fields);

        return response()->json([
            'message' => 'تم تحديث البيانات ️',
            'data' => $employee
        ]);
    }

    /**
     * حذف موظف
     *
     * إزالة سجل الموظف نهائياً من قاعدة البيانات.
     *
     * @urlParam employee integer required معرف الموظف (ID). مثال: 1
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'تم حذف الموظف من السجلات ']);
    }

    /**
     * البحث عن الموظفين
     *
     * البحث المتقدم عن الموظفين بناءً على معايير متعددة بدون تقسيم صفحات.
     */
    public function search(FilterEmployeeRequest $request)
    {
        $employees = Employee::latest()
            ->filter($request->validated())
            ->get();

        return response()->json([
            'message' => 'تم العثور على ' . $employees->count() . ' موظف مطابق للشروط ',
            'data' => $employees
        ]);
    }

    /**
     * تصدير تقرير CSV
     *
     * توليد وتحميل ملف CSV يحتوي على بيانات الموظفين بناءً على الفلاتر المختارة.
     *
     * @response 200 content-type=text/csv
     */
    public function export(FilterEmployeeRequest $request)
    {
        $employees = Employee::latest()->filter($request->validated())->get();

        $filename = 'employees_report_' . date('Y-m-d_H-i') . '.csv';

        $headers = [
            "Content-Type" => "text/csv",
            "Content-Disposition" => "attachment; filename=\"$filename\"",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($employees) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Joined Date']);

            foreach ($employees as $emp) {
                fputcsv($file, [
                    $emp->id,
                    $emp->name,
                    $emp->email,
                    $emp->department,
                    $emp->position,
                    $emp->salary,
                    $emp->joined_at,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
