<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function createEmployee(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح لك!'
            ], 403);
        }

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $employee = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'employee'
        ]);

        return response()->json([
            'message' => 'تم إنشاء حساب الموظف بنجاح',
            'data' => $employee
        ]);
    }
}
