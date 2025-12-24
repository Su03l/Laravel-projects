<?php

namespace App\Http\Controllers;

use App\Models\students;
use Illuminate\Http\Request;
use App\Http\Requests\StorestudentsRequest;
use App\Http\Requests\UpdatestudentsRequest;

class StudentsController extends Controller
{

    // 1. عرض كل الطلاب مع موادهم
    public function index()
    {
        $data = students::with('courses')->get();
        return response()->json($data);
    }

    // 2. إنشاء طالب جديد (رجعت لوظيفتها الأصلية)
    public function store(StorestudentsRequest $request)
    {
        $data = $request->validated();

        // ننشئ الطالب في الداتابيس
        $student = students::create($data);

        return response()->json([
            'message' => 'تم إنشاء الطالب بنجاح ✅',
            'student' => $student
        ], 201);
    }

    // 3. عرض طالب واحد (لاحظ: المتغير اسمه $student بالمفرد)
    public function show(students $student)
    {
        $student->load('courses'); // نجيب مواده معه
        return response()->json($student);
    }

    // 4. تحديث بيانات الطالب (الاسم/الايميل)
    public function update(UpdatestudentsRequest $request, students $student)
    {
        $data = $request->validated();
        $student->update($data);

        return response()->json([
            'message' => 'تم تحديث بيانات الطالب بنجاح ✨',
            'student' => $student
        ]);
    }

    // 5. حذف الطالب نهائياً من النظام (رجعت لوظيفتها الأصلية)
    public function destroy(students $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'تم حذف الطالب من النظام 🗑️'
        ]);
    }


    // 6. تسجيل مادة للطالب (Register Course)
    public function registerCourse(Request $request, students $student)
    {
        // التحقق من وجود المادة
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        // عملية الربط
        $student->courses()->attach($request->course_id);

        return response()->json([
            'message' => 'تم تسجيل المادة للطالب بنجاح ✅',
            'student' => $student->name,
            'registered_courses' => $student->courses
        ]);
    }

    // 7. إلغاء مادة من جدول الطالب (Cancel Course)
    public function cancelCourse(Request $request, students $student)
    {
        // التحقق من وجود المادة
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        // عملية فك الربط
        $student->courses()->detach($request->course_id);

        // تحديث البيانات للعرض
        $student->load('courses');

        return response()->json([
            'message' => 'تم إلغاء المادة من جدول الطالب 🗑️',
            'student' => $student->name,
            'remaining_courses' => $student->courses
        ]);
    }
}
