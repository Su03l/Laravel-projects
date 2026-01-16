<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = Contact::latest()
            ->filter($request->search)
            ->paginate(12);

        return response()->json($contacts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'nullable|string',
            'email' => 'nullable|email',
            'country_code' => 'required|string',
            'phone' => 'required|string',
            'details' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['first_name', 'last_name', 'email', 'country_code', 'phone', 'details']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('contacts', 'public');
        }

        $contact = Contact::create($data);

        return response()->json([
            'message' => 'مبروك يوحش سويت جهة اتصال جديدة',
            'contact' => $contact
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Contact::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $request->validate([
            'first_name' => 'required|string',
            'country_code' => 'required|string',
            'phone' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('photo');

        if ($request->hasFile('photo')) {
            if ($contact->photo) {
                Storage::disk('public')->delete($contact->photo);
            }
            $data['photo'] = $request->file('photo')->store('contacts', 'public');
        }

        $contact->update($data);

        return response()->json([
            'message' => 'ماهي مشكلة حدثت بيانات الجهة',
            'contact' => $contact
        ]);
    }


    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json([
            'message' => 'افا ورا حذفته '
        ]);
    }
}
