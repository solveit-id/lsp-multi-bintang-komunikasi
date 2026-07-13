<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }

    /**
     * Tambahkan metadata tambahan bila diperlukan.
     */
    public function with(Request $request): array
    {
        return [];
    }

    /**
     * Informasi tambahan pada response.
     */
    public function additionalInformation(): array
    {
        return [];
    }
}
