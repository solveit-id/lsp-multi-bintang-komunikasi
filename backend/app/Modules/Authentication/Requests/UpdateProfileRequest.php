<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Requests;

use App\Http\Requests\BaseRequest;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

final class UpdateProfileRequest extends BaseRequest
{
    /**
     * Determine whether the authenticated user is authorized
     * to update their profile.
     */
    public function authorize(): bool
    {
        return $this->user() instanceof User;
    }

    /**
     * Prepare the request data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('name')) {
            $data['name'] = trim((string) $this->input('name'));
        }

        if ($this->has('email')) {
            $data['email'] = mb_strtolower(
                trim((string) $this->input('email')),
            );
        }

        if ($data !== []) {
            $this->merge($data);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $this->uniqueEmailRule(),
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
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',

            'email.required' => 'The email field is required.',
            'email.string' => 'The email must be a string.',
            'email.email' => 'The email must be a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',
            'email.unique' => 'The email has already been taken.',
        ];
    }

    /**
     * Create the unique email rule while excluding
     * the currently authenticated user.
     */
    private function uniqueEmailRule(): Unique
    {
        $rule = Rule::unique(
            User::class,
            'email',
        );

        $user = $this->user();

        if ($user instanceof User) {
            $rule->ignore(
                $user->getKey(),
                $user->getKeyName(),
            );
        }

        return $rule;
    }
}
