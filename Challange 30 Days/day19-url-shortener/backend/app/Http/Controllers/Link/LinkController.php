<?php

namespace App\Http\Controllers\Link;

use App\Http\Controllers\Controller;
use App\Models\Link;
use App\Rules\SafeUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class LinkController extends Controller
{
// 1. عرض كل روابطي (History)
    public function index(Request $request)
    {
        $links = $request->user()->links()->latest()->get();
        return response()->json($links);
    }

    // 2. إنشاء رابط جديد (Store)
    public function store(Request $request)
    {
        $request->validate([
            'url' => ['required', 'url', new SafeUrl],
            'name' => 'nullable|string|max:255' // الاسم اختياري
        ]);

        $code = Str::random(6);

        $link = $request->user()->links()->create([
            'original_url' => $request->url,
            'short_code' => $code,
            'name' => $request->name // حفظ الاسم إن وجد
        ]);

        return response()->json([
            'message' => 'تم اختصار الرابط بنجاح',
            'short_url' => url('/' . $code),
            'data' => $link
        ], 201);
    }

    // 3. عرض رابط واحد للتفاصيل (Show)
    public function show(Request $request, $id)
    {
        // نبحث عن الرابط بشرط أن يكون تبع المستخدم الحالي
        $link = $request->user()->links()->findOrFail($id);

        return response()->json($link);
    }

    // 4. تعديل الرابط (Update)
    public function update(Request $request, $id)
    {
        // نأتي بالرابط الخاص بالمستخدم
        $link = $request->user()->links()->findOrFail($id);

        $request->validate([
            'url' => 'sometimes|url',      // sometimes يعني لو ارسلته نتحقق منه
            'name' => 'nullable|string|max:255'
        ]);

        // التحديث
        $link->update([
            'original_url' => $request->url ?? $link->original_url,
            'name' => $request->name ?? $link->name
        ]);

        return response()->json([
            'message' => 'تم تعديل الرابط بنجاح',
            'data' => $link
        ]);
    }

    // 5. حذف الرابط (Destroy)
    public function destroy(Request $request, $id)
    {
        $link = $request->user()->links()->findOrFail($id);

        $link->delete();

        return response()->json([
            'message' => 'تم حذف الرابط بنجاح'
        ]);
    }

    // 6. التحويل (Redirect) - للجمهور (بدون Auth)
    public function handle($code)
    {
        $link = Link::where('short_code', $code)->firstOrFail();
        $link->increment('visits');

        // بدلاً من التحويل المباشر:
        // return redirect()->away($link->original_url);

        // نعرض صفحة تحذير
        return view('redirect_warning', ['url' => $link->original_url]);
    }
}
