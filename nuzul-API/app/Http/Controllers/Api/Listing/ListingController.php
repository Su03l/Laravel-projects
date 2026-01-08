<?php

namespace App\Http\Controllers\Api\Listing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Listing\StoreListingRequest;
use App\Http\Requests\Listing\UpdateListingRequest;
use App\Http\Resources\Listing\ListingResource;
use App\Models\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::with('user');

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has(['from_date', 'to_date'])) {
            $query->whereDoesntHave('bookings', function ($q) use ($request) {
                $q->where('status', '!=', 'cancelled')
                    ->where(function ($sub) use ($request) {
                        $sub->whereBetween('check_in', [$request->from_date, $request->to_date])
                            ->orWhereBetween('check_out', [$request->from_date, $request->to_date])
                            ->orWhere(function ($cover) use ($request) {
                                $cover->where('check_in', '<', $request->from_date)
                                    ->where('check_out', '>', $request->to_date);
                            });
                    });
            });
        }

        return ListingResource::collection($query->paginate(10));
    }

    public function store(StoreListingRequest $request)
    {
        $listing = $request->user()->listings()->create($request->validated());

        return response()->json([
            'message' => 'تم إضافة العقار بنجاح',
            'data' => new ListingResource($listing)
        ], 201);
    }

    public function show($id)
    {
        $listing = Listing::with('user')->findOrFail($id);

        return new ListingResource($listing);
    }

    public function update(UpdateListingRequest $request, $id)
    {
        $listing = Listing::findOrFail($id);

        if ($request->user()->id !== $listing->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بتعديل هذا العقار'
            ], 403);
        }

        $listing->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث العقار بنجاح',
            'data' => new ListingResource($listing)
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        if ($request->user()->id !== $listing->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف هذا العقار'
            ], 403);
        }

        $listing->delete();

        return response()->json([
            'message' => 'تم حذف العقار بنجاح'
        ]);
    }
}
