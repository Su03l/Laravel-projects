<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Http\Request;

class WorkspaceMemberController extends Controller
{
    // this for invite member to workspace
    public function invite(Request $request, Workspace $workspace)
    {
        // تحقق أن المستخدم الحالي هو المالك أو أدمن (Policy)
        if ($workspace->owner_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate(['email' => 'required|email|exists:users,email']);

        $userToAdd = User::where('email', $request->email)->first();

        // منع التكرار
        if ($workspace->members()->where('user_id', $userToAdd->id)->exists()) {
            return back()->withErrors(['email' => 'User already in workspace!']);
        }

        $workspace->members()->attach($userToAdd->id, ['role' => 'member']);

        return back()->with('success', 'Member added successfully!');
    }
}
