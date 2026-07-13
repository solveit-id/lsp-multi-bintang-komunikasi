<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Requests;

use App\Http\Requests\BaseRequest;
use App\Models\User;
use Illuminate\Validation\Rules\Password;

final class ChangePasswordRequest extends BaseRequest
{
    /**
     * Determine whether the authenticated user is authorized
     * to change their password.
     */
    public function authorize(): bool
    {
        return $this->user() instanceof User;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'current_password' => [
                'required',
                'string',
            ],
            'password' => [
                'required',
                'string',
                Password::min(8),
                'confirmed',
                'different:current_password',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'current_password.required' => 'The current password field is required.',
            'current_password.string' => 'The current password must be a string.',

            'password.required' => 'The new password field is required.',
            'password.string' => 'The new password must be a string.',
            'password.min' => 'The new password must be at least 8 characters.',
            'password.confirmed' => 'The new password confirmation does not match.',
            'password.different' => 'The new password must be different from the current password.',
        ];
    }

    /**
     * Get the validated current password.
     */
    public function currentPassword(): string
    {
        return (string) $this->validated('current_password');
    }

    /**
     * Get the validated new password.
     */
    public function newPassword(): string
    {
        return (string) $this->validated('password');
    }
}
