<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LinkController extends Controller
{
    public function index()
    {
        return response()->json(Link::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        //create random 6 digits
        $code = Str::random(6);

        //check if code exists
        while (Link::where('code', $code)->exists()) {
            $code = Str::random(6);
        }

        $link = Link::create([
            'original_url' => $request->url,
            'code' => $code
        ]);

        return response()->json([
            'message' => 'Short link created successfully',
            'short_url' => url('/api/go/' . $code),
            'data' => $link
        ], 201);
    }

    public function redirect($code)
    {

        //find the url
        $link = Link::where('code', $code)->firstOrFail();

        //++ visits
        $link->increment('visits');

        //redirect to original url
        return redirect()->away($link->original_url);
    }

    public function stats($code)
    {
        $link = Link::where('code', $code)->firstOrFail();
        return response()->json($link);
    }
}
