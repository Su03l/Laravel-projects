<?php

namespace App\Http\Controllers;

use App\Models\phonenumber;
use App\Http\Requests\StorephonenumberRequest;
use App\Http\Requests\UpdatephonenumberRequest;

class PhonenumberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contact = phonenumber::all();
        return response()->json($contact);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorephonenumberRequest $request)
    {
        $contact = Phonenumber::create($request->validated());
        return response()->json([
            'message' => 'تم الحفظ بنجاح',
            'data' => $contact
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(phonenumber $phonenumber)
    {
        $phone = phonenumber::find($phonenumber->phonenumber_id);
        return response()->json($phonenumber);
    }

    public function searchByNumber($number)
    {
        $contact = phonenumber::where('number', $number)->first();

        if (!$contact) {
            return response()->json([
                'message' => 'عذرا الرقم الذي طلبته غير متوفر',

            ], 404);
        }

        return response()->json([
            'message' => 'تم العثور',
            'data' => $contact
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatephonenumberRequest $request, phonenumber $phonenumber)
    {
        $phonenumber->update($request->validated());
        return response()->json([
            'message' => 'تم التعديل بنجاح',
            'data' => $phonenumber
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(phonenumber $phonenumber)
    {
        $phonenumber->delete();
        return response()->json($phonenumber);
    }
}
