<?php

namespace App\Http\Controllers\Api\General;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponseTrait;

    // the index method for get all notifications
    public function index(Request $request)
    {
        return $this->successResponse($request->user()->notifications, 'Notifications retrieved');
    }

    // the markAsRead method for mark all notifications as read
    public function markAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return $this->successResponse(null, 'All notifications marked as read');
    }
}
