<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Rental;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RentalController extends Controller
{
    public function index()
    {
        $rentals = Rental::with(['car', 'customer'])->latest()->get();
        return response()->json($rentals);
    }

    // 2. إنشاء عقد جديد
    public function store(Request $request)
    {
        $request->validate([
            'car_id' => 'required|exists:cars,id',
            'customer_id' => 'required|exists:customers,id',
            'start_date' => 'nullable|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        return DB::transaction(function () use ($request) {
            $car = Car::find($request->car_id);

            // التحقق من حالة السيارة
            if ($car->status !== 'available') {
                return response()->json([
                    'message' => "عذراً، السيارة غير متاحة حالياً (حالتها: $car->status)"
                ], 400);
            }

            // Use current time if start_date is not provided
            $startDate = $request->start_date ? Carbon::parse($request->start_date) : now();
            $endDate = Carbon::parse($request->end_date);

            $days = $startDate->diffInDays($endDate);
            if ($days == 0) $days = 1;

            $totalCost = $days * $car->daily_price;

            $rental = Rental::create([
                'car_id' => $request->car_id,
                'customer_id' => $request->customer_id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_cost' => $totalCost,
                'status' => 'active'
            ]);

            $car->update(['status' => 'rented']);

            return response()->json([
                'message' => 'تم فتح العقد بنجاح ',
                'data' => $rental
            ], 201);
        });
    }

    // 3. عرض عقد واحد
    public function show(Rental $rental)
    {
        return response()->json($rental->load(['car', 'customer']));
    }

    public function update(Request $request, Rental $rental)
    {
        // ممنوع تعديل عقد منتهي
        if ($rental->status === 'completed') {
            return response()->json(['message' => 'لا يمكن تعديل عقد منتهي'], 400);
        }

        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
        ]);

        return DB::transaction(function () use ($request, $rental) {

            $rental->fill($request->only(['start_date', 'end_date']));

            if ($rental->isDirty(['start_date', 'end_date'])) {
                $start = Carbon::parse($rental->start_date);
                $end = Carbon::parse($rental->end_date);
                $days = $start->diffInDays($end);
                if ($days == 0) $days = 1;

                $rental->total_cost = $days * $rental->car->daily_price;
            }

            $rental->save();

            return response()->json([
                'message' => 'تم تحديث العقد وإعادة حساب التكلفة ',
                'data' => $rental
            ]);
        });
    }

    // 5. حذف العقد نهائياً
    public function destroy(Rental $rental)
    {
        return DB::transaction(function () use ($rental) {

            // لو العقد كان "جاري"، لازم نرجع السيارة "متاحة" قبل الحذف
            // عشان السيارة ما تختفي حالتها وتصير معلقة
            if ($rental->status === 'active') {
                $rental->car->update(['status' => 'available']);
            }

            $rental->delete();

            return response()->json([
                'message' => 'تم حذف العقد واسترجاع حالة السيارة '
            ]);
        });
    }

    // 6. دالة خاصة: إرجاع السيارة (تسليم)
    public function returnCar(Rental $rental)
    {
        if ($rental->status === 'completed') {
            return response()->json(['message' => 'السيارة مستلمة مسبقاً'], 400);
        }

        DB::transaction(function () use ($rental) {
            $rental->update(['status' => 'completed']);
            $rental->car->update(['status' => 'available']);
        });

        return response()->json([
            'message' => 'تم استلام السيارة وإغلاق العقد ',
            'car' => $rental->car->name
        ]);
    }
}
