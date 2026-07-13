<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Data\ArrayableData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

abstract class BaseApiController extends Controller
{
    /**
     * Success response.
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = Response::HTTP_OK,
        array $meta = []
    ): JsonResponse {
        if ($data instanceof ArrayableData) {
            $data = $data->toArray();
        }

        $response = [
            'success' => true,
            'message' => $message,
        ];

        if (! is_null($data)) {
            $response['data'] = $data;
        }

        if (! empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $status);
    }

    /**
     * Error response.
     */
    protected function error(
        string $message = 'Error',
        int $status = Response::HTTP_BAD_REQUEST,
        array $errors = []
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
