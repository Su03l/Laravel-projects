<?php

namespace App\Traits;

trait ApiResponseTrait
{
    /**
     * Success Response
     */
    public function successResponse($data, $message = 'Operation successful', $code = 200)
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error Response
     */
    public function errorResponse($message = 'Something went wrong', $code = 400, $errors = [])
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
