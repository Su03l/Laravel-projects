<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchPropertyRequest;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{

    /**
     * عرض قائمة العقارات
     *
     * جلب جميع العقارات المتاحة مع ميزة التصفية والتقسيم لصفحات.
     *
     * @queryParam page integer رقم الصفحة (افتراضي: 1).
     * @queryParam city string تصفية حسب المدينة.
     * @queryParam type string تصفية حسب النوع (apartment, villa, land).
     */
    public function index(Request $request)
    {
        $properties = Property::latest()
            ->filter($request->all())
            ->paginate(10);

        return response()->json($properties);
    }

    /**
     * إضافة عقار جديد
     *
     * إنشاء سجل عقار جديد في قاعدة البيانات.
     *
     * @bodyParam title string required عنوان العقار.
     * @bodyParam description string required وصف مفصل للعقار.
     * @bodyParam price number required سعر العقار.
     * @bodyParam area integer required المساحة بالمتر المربع.
     * @bodyParam city string required المدينة.
     * @bodyParam rooms integer required عدد الغرف.
     * @bodyParam bathrooms integer required عدد دورات المياه.
     * @bodyParam type string required نوع العقار (apartment, villa, land).
     * @bodyParam status string required حالة العقار (sale, rent).
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'area' => 'required|integer|min:1',
            'city' => 'required|string',
            'rooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'type' => 'required|in:apartment,villa,land',
            'status' => 'required|in:sale,rent',
        ]);

        $property = Property::create($fields);

        return response()->json([
            'message' => 'تم إضافة العقار بنجاح ',
            'data' => $property
        ], 201);
    }

    /**
     * عرض تفاصيل عقار محدد
     *
     * جلب كافة البيانات الخاصة بعقار واحد باستخدام المعرف (ID).
     *
     * @urlParam id integer required معرف العقار.
     */
    public function show(Property $property)
    {
        return response()->json($property);
    }

    /**
     * تحديث بيانات عقار
     *
     * تعديل بيانات عقار موجود مسبقاً. يمكنك إرسال الحقول التي ترغب بتعديلها فقط.
     *
     * @urlParam id integer required معرف العقار المراد تحديثه.
     * @bodyParam title string عنوان العقار.
     * @bodyParam price number سعر العقار.
     * @bodyParam status string حالة العقار (sale, rent).
     */
    public function update(Request $request, Property $property)
    {
        $fields = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'area' => 'sometimes|integer|min:1',
            'city' => 'sometimes|string',
            'rooms' => 'sometimes|integer|min:1',
            'bathrooms' => 'sometimes|integer|min:1',
            'type' => 'sometimes|in:apartment,villa,land',
            'status' => 'sometimes|in:sale,rent',
        ]);

        $property->update($fields);

        return response()->json([
            'message' => 'تم تحديث بيانات العقار ️',
            'data' => $property
        ]);
    }

    /**
     * حذف عقار
     *
     * إزالة سجل العقار نهائياً من قاعدة البيانات.
     *
     * @urlParam id integer required معرف العقار المراد حذفه.
     */
    public function destroy(Property $property)
    {
        $property->delete();
        return response()->json([
            'message' => 'تم حذف العقار بنجاح',
        ]);
    }

    /**
     * بحث متقدم في العقارات
     *
     * استخدم هذا الرابط لتصفية النتائج بناءً على المدينة، السعر، النوع، وغيرها.
     *
     * @queryParam city string البحث باسم المدينة (مثال: Riyadh).
     * @queryParam type string نوع العقار (apartment, villa, land).
     * @queryParam status string حالة العقار (sale, rent).
     * @queryParam min_price number أقل سعر مطلوب.
     * @queryParam max_price number أعلى سعر مطلوب.
     * @queryParam rooms integer عدد الغرف (سيجلب هذا العدد أو أكثر).
     * @queryParam area integer المساحة التقريبية بالمتر.
     */
    public function search(SearchPropertyRequest $request)
    {
        $results = Property::latest()->filter($request->validated())->get();

        return response()->json([
            'message' => 'تم العثور على ' . $results->count() . ' عقار ',
            'data' => $results
        ]);
    }
}
