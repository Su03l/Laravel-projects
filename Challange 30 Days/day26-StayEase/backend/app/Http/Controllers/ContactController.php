<?php

namespace App\Http\Controllers;

use App\Mail\ContactUsMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'بيانات غير صالحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'email', 'subject', 'message']);

        // تم تغيير الإيميل إلى بريدك الشخصي لتستقبل الرسائل عليه أثناء التجربة
        // لأن admin@stayease.com غير موجود فعلياً
        Mail::to('authsystem72@gmail.com')->send(new ContactUsMail($data));

        return response()->json([
            'message' => 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.',
        ], 200);
    }
}
