# Authentication Module

## Overview

The Authentication module is responsible for managing user authentication,
access control, authenticated user information, personal access token lifecycle,
profile management, and password management for the LSP Multi Bintang
Komunikasi backend.

This module provides the foundation for every authenticated API request and
acts as the single entry point for authentication-related business logic.

The implementation follows the architecture defined by the project's
Architecture Decision Records (ADR) and complies with the following project
principles:

- Architecture Freeze
- Roadmap Freeze
- Implementation Freeze

No architectural changes are introduced inside this module without updating the
corresponding ADR.

---

## Responsibilities

The Authentication module is responsible for the following features:

- User Login
- User Logout
- Current Authenticated User (Me)
- Personal Access Token Lifecycle
- Profile Management
- Change Password

The following authentication features are intentionally postponed and are not
part of the current implementation:

- Forgot Password
- Reset Password
- Email Verification

These features can be implemented in future roadmap phases without requiring
changes to the existing architecture.

---

## Architecture

The Authentication module follows the project's standard backend architecture.

```
HTTP Request
        │
        ▼
Form Request
        │
        ▼
DTO
        │
        ▼
Controller
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Eloquent Model
        │
        ▼
API Resource
        │
        ▼
JSON Response
```

The following architectural patterns are implemented throughout the module:

- Modular Monolith
- Repository Pattern
- Service Layer
- Data Transfer Object (DTO)
- Request Validation
- API Resource
- Dependency Injection
- Business Exception
- Contracts
- Base Repository
- Base Service
- Base Model

This architecture is shared across all modules within the backend to ensure
consistency, maintainability, scalability, and predictable development
practices.

---

# Module Structure

The Authentication module follows the project's modular architecture and keeps
each responsibility in its own layer.

```text
Authentication
│
├── Constants
│
├── Contracts
│
├── Controllers
│
├── DTOs
│
├── Exceptions
│
├── Providers
│
├── Repositories
│
├── Requests
│
├── Resources
│
├── routes
│
├── Services
│
└── README.md
```

Each directory has a dedicated responsibility and should only contain
components that belong to its layer.

| Directory | Responsibility |
|------------|----------------|
| Constants | Shared constants used throughout the Authentication module. |
| Contracts | Public interfaces for repositories, services, and token management. |
| Controllers | Receive HTTP requests and delegate business logic to services. |
| DTOs | Transport validated data between application layers. |
| Exceptions | Authentication-specific business exceptions. |
| Providers | Register dependency injection bindings for the module. |
| Repositories | Encapsulate all persistence logic related to authentication. |
| Requests | Validate incoming HTTP requests. |
| Resources | Transform domain objects into API responses. |
| routes | Register Authentication API endpoints. |
| Services | Implement Authentication business logic. |

---

# Layer Responsibilities

The Authentication module strictly follows the layer separation defined by the
project Architecture Decision Records.

## Controller Layer

Responsibilities:

- Receive HTTP requests
- Delegate business logic to services
- Return API Resources
- Never access Eloquent models directly
- Never contain business rules

Current controllers:

- LoginController
- LogoutController
- MeController
- ProfileController
- ChangePasswordController

---

## Request Layer

Responsibilities:

- Validate request payloads
- Normalize user input when necessary
- Authorize requests when required
- Produce validated data for DTOs

Current requests:

- LoginRequest
- UpdateProfileRequest
- ChangePasswordRequest

---

## DTO Layer

Responsibilities:

- Transfer validated data between layers
- Provide immutable application data
- Decouple HTTP requests from business logic

Current DTOs:

- LoginData
- LoginResponseData
- AuthenticatedUserData
- UpdateProfileData
- ChangePasswordData

---

## Service Layer

Responsibilities:

- Implement business logic
- Coordinate repositories
- Manage authentication workflow
- Coordinate token lifecycle
- Throw business exceptions when necessary

Current services:

- AuthenticationService
- AuthenticationTokenManager

---

## Repository Layer

Responsibilities:

- Encapsulate persistence logic
- Interact with Eloquent models
- Hide database implementation details
- Never contain business rules

Current repository:

- AuthenticationRepository

---

## Resource Layer

Responsibilities:

- Transform domain objects into API responses
- Prevent exposure of internal attributes
- Keep response structure consistent

Current resources:

- AuthenticatedUserResource

---

## Exception Layer

Responsibilities:

- Represent business failures
- Provide predictable API errors
- Integrate with the project's Business Exception architecture

Current exceptions include:

- AuthenticationException
- InvalidCredentialsException
- InvalidTokenException
- AccountDisabledException
- AccountLockedException
- EmailNotVerifiedException
- PasswordExpiredException

---

# Dependency Flow

The Authentication module follows a one-directional dependency flow.

```text
Controller
      │
      ▼
Request
      │
      ▼
DTO
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Model
      │
      ▼
Resource
```

Dependencies must always move downward.

Reverse dependencies are not allowed.

Repositories must never call services.

Resources must never contain business logic.

Controllers must never access repositories directly.

Requests must never access repositories.

This dependency rule is mandatory for every future Authentication feature.

# Authentication Flows

This section documents the runtime flow of every Authentication feature currently implemented in the backend.

The flows described below reflect the actual implementation and must remain consistent with the existing contracts, controllers, DTOs, services, repositories, resources, middleware, and token lifecycle policy.

---

## Login Flow

The Login flow authenticates a user using an email address and password, then creates a Laravel Sanctum personal access token.

```text
POST /api/auth/login
        │
        ▼
LoginRequest
        │
        ▼
Validated Credentials
        │
        ▼
LoginData
        │
        ▼
LoginController
        │
        ▼
AuthenticationService::login()
        │
        ├── AuthenticationRepository::findByEmail()
        │
        ├── Verify Password Hash
        │
        └── AuthenticationTokenManager::create()
        │
        ▼
LoginResponseData
        │
        ▼
JSON Response
```

### Login Responsibilities

`LoginRequest` is responsible for:

* validating the email;
* validating the password;
* providing validated credentials.

`LoginData` is responsible for:

* transporting validated login credentials;
* keeping the service independent from the HTTP request.

`AuthenticationService::login()` is responsible for:

* retrieving the user through the repository;
* verifying the submitted password;
* rejecting invalid credentials;
* creating a personal access token;
* creating the login response DTO.

`AuthenticationTokenManager::create()` is responsible for:

* creating the Sanctum personal access token;
* returning the plain-text token to the service.

### Login Failure Behavior

An invalid email or password produces the same authentication failure response.

This prevents account enumeration by ensuring the API does not reveal whether a specific email address exists.

A failed login must not create a personal access token.

---

## Logout Flow

The Logout flow revokes only the personal access token used by the current request.

```text
POST /api/auth/logout
        │
        ▼
auth:sanctum
        │
        ▼
LogoutController
        │
        ▼
AuthenticationService::logout()
        │
        ▼
AuthenticationTokenManager::revokeCurrent()
        │
        ▼
Current Token Deleted
        │
        ▼
Success Response
```

### Logout Token Policy

Logout follows the current-device policy:

```text
Current access token
        → revoked

Other access tokens owned by the same user
        → remain active

Access tokens owned by other users
        → remain active
```

Logout does not invoke:

```text
AuthenticationTokenManager::revokeAll()
```

The authenticated user can continue using other active sessions after logging out from the current session.

---

## Current Authenticated User Flow

The Current Authenticated User flow returns the public representation of the user associated with the active Sanctum token.

```text
GET /api/auth/me
        │
        ▼
auth:sanctum
        │
        ▼
MeController
        │
        ▼
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
        │
        ▼
JSON Response
```

### Current User Response

The response exposes only the public user attributes defined by `AuthenticatedUserResource`.

The response currently includes:

* public UUID;
* name;
* email.

The response must not expose:

* internal database ID;
* password hash;
* remember token;
* personal access token records;
* current access token model.

The official service operation for this flow is:

```text
me()
```

The deprecated name below is not used:

```text
getAuthenticatedUser()
```

---

## Profile Update Flow

The Profile Update flow updates the authenticated user's name and email address.

```text
PUT /api/auth/profile
        │
        ▼
auth:sanctum
        │
        ▼
UpdateProfileRequest
        │
        ├── Validate Name
        ├── Validate Email
        ├── Normalize Name
        └── Normalize Email
        │
        ▼
UpdateProfileData
        │
        ▼
UpdateProfileController
        │
        ▼
AuthenticationService::updateProfile()
        │
        ▼
AuthenticationRepository::updateProfile()
        │
        ▼
Updated User
        │
        ▼
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
        │
        ▼
JSON Response
```

### Profile Update Scope

The Profile Management contract currently permits updates to:

* name;
* email.

The endpoint does not permit direct updates to:

* UUID;
* password;
* account status;
* role;
* permissions;
* email verification timestamp;
* remember token;
* access tokens.

Only data returned by `UpdateProfileRequest::validated()` and represented by `UpdateProfileData` reaches the repository.

### Profile Token Policy

A successful profile update does not revoke any personal access token.

```text
Current token
        → remains active

Secondary tokens
        → remain active
```

This allows all authenticated sessions to observe the latest persisted profile information through the `/api/auth/me` endpoint.

---

## Change Password Flow

The Change Password flow verifies the current password, hashes the new password, persists it, and revokes all active personal access tokens owned by the user.

```text
PUT /api/auth/password
        │
        ▼
auth:sanctum
        │
        ▼
ChangePasswordRequest
        │
        ├── Validate Current Password Input
        ├── Validate New Password
        ├── Validate Password Confirmation
        └── Ensure New Password Differs
        │
        ▼
ChangePasswordData
        │
        ▼
ChangePasswordController
        │
        ▼
AuthenticationService::changePassword()
        │
        ├── Verify Current Password
        ├── Hash New Password
        ├── AuthenticationRepository::updatePassword()
        └── AuthenticationTokenManager::revokeAll()
        │
        ▼
Success Response
```

### Password Verification

The request layer validates the structure of the submitted payload.

The service layer verifies whether the submitted current password matches the user's stored password hash.

```text
ChangePasswordRequest
        → validates input structure

AuthenticationService
        → verifies password correctness
```

The request layer does not access the stored password hash.

The repository layer does not verify the current password.

### Password Persistence

The service hashes the new password before passing it to the repository.

```text
Plain-text new password
        │
        ▼
AuthenticationService
        │
        ▼
Hashed password
        │
        ▼
AuthenticationRepository::updatePassword()
```

The repository receives only the hashed password.

The plain-text password must never be persisted, logged, returned, or exposed through an API Resource.

### Change Password Token Policy

A successful password change revokes all personal access tokens owned by the user.

```text
Current token
        → revoked

Secondary tokens
        → revoked

Tokens owned by other users
        → remain active
```

After changing the password, the user must authenticate again using the new password to obtain a new access token.

### Change Password Failure Behavior

If the current password is incorrect:

* the password is not changed;
* the repository is not called;
* no personal access token is revoked;
* the existing authenticated sessions remain active;
* an authentication business exception is returned.

---

## Token Lifecycle Flow

The Authentication module centralizes personal access token operations through `AuthenticationTokenManager`.

```text
AuthenticationTokenManagerInterface
        │
        ├── create(User $user): string
        ├── revokeCurrent(User $user): void
        └── revokeAll(User $user): void
```

### Create Token

Used by:

```text
AuthenticationService::login()
```

Behavior:

```text
Valid credentials
        │
        ▼
Create Sanctum token
        │
        ▼
Store token hash
        │
        ▼
Return plain-text token once
```

Sanctum stores the token hash in the database. The plain-text token is returned only when the token is created.

### Revoke Current Token

Used by:

```text
AuthenticationService::logout()
```

Behavior:

```text
Delete the access token associated with the current request
```

Other tokens owned by the same user remain active.

### Revoke All Tokens

Used by:

```text
AuthenticationService::changePassword()
```

Behavior:

```text
Delete every personal access token owned by the authenticated user
```

Tokens belonging to other users are not affected.

---

## Business Exception Flow

Authentication business failures are represented by Authentication-specific exceptions and processed through the project's exception handling foundation.

```text
Authentication Service
        │
        ▼
Authentication Business Exception
        │
        ▼
Global Exception Renderer
        │
        ▼
Consistent JSON Error Response
```

Examples include:

* `InvalidCredentialsException`;
* `InvalidTokenException`;
* `AccountDisabledException`;
* `AccountLockedException`;
* `EmailNotVerifiedException`;
* `PasswordExpiredException`.

Only exceptions actively used by the current implementation affect runtime behavior.

The existence of an exception class does not automatically mean its associated business rule has been activated.

---

## Complete Authentication Journey

A complete supported Authentication journey currently follows this sequence:

```text
Login
        │
        ▼
Receive Personal Access Token
        │
        ▼
Access /me
        │
        ▼
Update Profile
        │
        ▼
Access /me with Updated Profile
        │
        ▼
Change Password
        │
        ▼
All Previous Tokens Revoked
        │
        ▼
Login Again with New Password
        │
        ▼
Receive New Personal Access Token
        │
        ▼
Logout
        │
        ▼
Current Token Revoked
```

This flow has been verified through:

* individual feature integration tests;
* token lifecycle tests;
* cross-feature integration tests;
* security tests;
* regression tests.

---

## Deferred Authentication Flows

The following flows are intentionally deferred and are not part of the current module implementation:

```text
Forgot Password
Reset Password
Email Verification
```

They must not be referenced as active endpoints or completed features.

Future implementation must reuse the existing Authentication architecture without replacing or restructuring the current module.

---

# API Endpoints

This section documents every public API endpoint currently implemented by the Authentication module.

All endpoints return JSON responses and follow the project's standard API response format.

---

## Endpoint Summary

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/api/auth/login` | No | Authenticate a user and issue a personal access token. |
| POST | `/api/auth/logout` | Yes | Revoke the current personal access token. |
| GET | `/api/auth/me` | Yes | Retrieve the currently authenticated user. |
| PUT | `/api/auth/profile` | Yes | Update the authenticated user's profile. |
| PUT | `/api/auth/password` | Yes | Change the authenticated user's password and revoke all active tokens. |

---

# POST /api/auth/login

Authenticates a user using an email address and password.

Authentication Required:

```text
No
```

### Request Body

```json
{
    "email": "john@example.com",
    "password": "SecretPassword123!"
}
```

### Success Response

HTTP Status

```text
200 OK
```

Response Body

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "token": "...",
        "user": {
            "uuid": "...",
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
}
```

### Possible Responses

| Status | Description |
|---------|-------------|
| 200 | Login successful |
| 401 | Invalid credentials |
| 422 | Validation failed |

---

# POST /api/auth/logout

Revokes only the current personal access token.

Authentication Required:

```text
Yes (Sanctum)
```

Authorization Header

```text
Authorization: Bearer {token}
```

### Request Body

```text
None
```

### Success Response

HTTP Status

```text
200 OK
```

Example Response

```json
{
    "success": true,
    "message": "Logout successful."
}
```

### Token Policy

```text
Current Token
        → Revoked

Other Tokens
        → Remain Active
```

### Possible Responses

| Status | Description |
|---------|-------------|
| 200 | Logout successful |
| 401 | Unauthenticated |

---

# GET /api/auth/me

Returns the authenticated user's public information.

Authentication Required:

```text
Yes (Sanctum)
```

Authorization Header

```text
Authorization: Bearer {token}
```

### Request Body

```text
None
```

### Success Response

HTTP Status

```text
200 OK
```

Response Body

```json
{
    "success": true,
    "data": {
        "uuid": "...",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Returned Fields

| Field | Description |
|--------|-------------|
| uuid | Public user identifier |
| name | User name |
| email | User email |

### Hidden Fields

The following attributes are never exposed:

- id
- password
- remember_token
- personal_access_tokens

### Possible Responses

| Status | Description |
|---------|-------------|
| 200 | User retrieved |
| 401 | Unauthenticated |

---

# PUT /api/auth/profile

Updates the authenticated user's profile information.

Authentication Required:

```text
Yes (Sanctum)
```

Authorization Header

```text
Authorization: Bearer {token}
```

### Request Body

```json
{
    "name": "John Doe",
    "email": "john@example.com"
}
```

### Validation Rules

| Field | Rules |
|--------|------|
| name | required, string, max:255 |
| email | required, string, email, max:255, unique except current user |

### Success Response

HTTP Status

```text
200 OK
```

Response Body

```json
{
    "success": true,
    "message": "Profile updated successfully.",
    "data": {
        "uuid": "...",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Token Policy

Updating the profile does not revoke any access token.

```text
Current Token
        → Active

Other Tokens
        → Active
```

### Possible Responses

| Status | Description |
|---------|-------------|
| 200 | Profile updated |
| 401 | Unauthenticated |
| 422 | Validation failed |

---

# PUT /api/auth/password

Changes the authenticated user's password.

Authentication Required:

```text
Yes (Sanctum)
```

Authorization Header

```text
Authorization: Bearer {token}
```

### Request Body

```json
{
    "current_password": "OldPassword123!",
    "password": "NewPassword123!",
    "password_confirmation": "NewPassword123!"
}
```

### Validation Rules

| Field | Rules |
|--------|------|
| current_password | required |
| password | required, confirmed, password rules |
| password_confirmation | required |

### Success Response

HTTP Status

```text
200 OK
```

Example Response

```json
{
    "success": true,
    "message": "Password changed successfully."
}
```

### Token Policy

A successful password change revokes every active personal access token owned by the authenticated user.

```text
Current Token
        → Revoked

Secondary Tokens
        → Revoked
```

The user must authenticate again using the new password.

### Possible Responses

| Status | Description |
|---------|-------------|
| 200 | Password changed |
| 401 | Invalid current password or unauthenticated |
| 422 | Validation failed |

---

# Authentication Middleware

The following endpoints are protected by the `auth:sanctum` middleware:

| Endpoint |
|----------|
| POST `/api/auth/logout` |
| GET `/api/auth/me` |
| PUT `/api/auth/profile` |
| PUT `/api/auth/password` |

The login endpoint is intentionally public.

---

# Response Convention

All Authentication endpoints follow the project's standardized API response format.

Successful responses contain:

```json
{
    "success": true,
    "message": "...",
    "data": { }
}
```

Validation failures follow the Laravel validation response format.

Authentication failures return an error generated by the project's Business Exception layer.

No endpoint exposes:

- internal database identifiers;
- password hashes;
- remember tokens;
- Sanctum token hashes;
- Eloquent internal attributes.

---

# DTO, Request, and Resource Documentation

This section documents the data transport, request validation, and API representation components used by the Authentication module.

These layers provide a strict boundary between HTTP input, application business logic, persistence, and API output.

---

# Data Transfer Objects

Data Transfer Objects provide immutable and typed data structures for communication between the controller and service layers.

Authentication DTOs must not:

* access the database;
* resolve the authenticated user;
* perform authorization;
* execute HTTP validation;
* call repositories;
* generate JSON responses;
* manage personal access tokens.

All Authentication DTOs implement the shared `ArrayableData` contract when array conversion is required.

---

## LoginData

File:

```text
app/Modules/Authentication/DTOs/LoginData.php
```

Purpose:

`LoginData` transports validated login credentials from `LoginController` to `AuthenticationService`.

Data flow:

```text
LoginRequest::validated()
        │
        ▼
LoginData
        │
        ▼
AuthenticationService::login()
```

Primary attributes:

| Attribute | Type   | Description                                                |
| --------- | ------ | ---------------------------------------------------------- |
| email     | string | Validated user email address.                              |
| password  | string | Plain-text password used only for credential verification. |

The password remains in plain text only until the service verifies it against the stored password hash.

It must never be:

* logged;
* persisted directly;
* returned in an API response;
* included in an API Resource.

---

## LoginResponseData

File:

```text
app/Modules/Authentication/DTOs/LoginResponseData.php
```

Purpose:

`LoginResponseData` represents the result of a successful authentication process.

Primary data:

| Attribute | Description                                             |
| --------- | ------------------------------------------------------- |
| token     | Newly created Sanctum plain-text personal access token. |
| user      | Authenticated user data returned by the Login flow.     |

Data flow:

```text
AuthenticationService::login()
        │
        ├── Authenticated user data
        └── Personal access token
        │
        ▼
LoginResponseData
        │
        ▼
LoginController
        │
        ▼
JSON Response
```

The plain-text token is available only when Sanctum creates the token. The database stores only the hashed token value.

`LoginResponseData` must never contain:

* the submitted password;
* the stored password hash;
* the internal token hash;
* the user's internal database ID.

---

## AuthenticatedUserData

File:

```text
app/Modules/Authentication/DTOs/AuthenticatedUserData.php
```

Purpose:

`AuthenticatedUserData` represents the public data of the currently authenticated user.

It is used by:

* `AuthenticationService::me()`;
* `AuthenticationService::updateProfile()`;
* `AuthenticatedUserResource`.

Primary attributes:

| Attribute | Type   | Description             |
| --------- | ------ | ----------------------- |
| uuid      | string | Public user identifier. |
| name      | string | User display name.      |
| email     | string | User email address.     |

Data flow:

```text
User Model
        │
        ▼
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
```

The DTO must not expose:

* internal database ID;
* password hash;
* remember token;
* token relationships;
* current access token;
* internal model attributes.

---

## UpdateProfileData

File:

```text
app/Modules/Authentication/DTOs/UpdateProfileData.php
```

Purpose:

`UpdateProfileData` transports validated profile information from `UpdateProfileController` to `AuthenticationService`.

Primary attributes:

| Attribute | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| name      | string | Normalized user name.          |
| email     | string | Normalized user email address. |

Data flow:

```text
UpdateProfileRequest::validated()
        │
        ▼
UpdateProfileData
        │
        ▼
AuthenticationService::updateProfile()
        │
        ▼
AuthenticationRepository::updateProfile()
```

`UpdateProfileData` intentionally excludes:

* UUID;
* password;
* account status;
* role;
* permissions;
* email verification state;
* remember token;
* access token information.

This limitation prevents attributes outside the Profile Management contract from reaching the repository.

---

## ChangePasswordData

File:

```text
app/Modules/Authentication/DTOs/ChangePasswordData.php
```

Purpose:

`ChangePasswordData` transports the current password and validated new password from `ChangePasswordController` to `AuthenticationService`.

Primary attributes:

| Attribute       | Type   | Description                                                           |
| --------------- | ------ | --------------------------------------------------------------------- |
| currentPassword | string | Current plain-text password used for verification.                    |
| password        | string | Validated new plain-text password that will be hashed by the service. |

Request-to-DTO mapping:

```text
current_password
        → currentPassword

password
        → password
```

`password_confirmation` is not stored in the DTO because it is used only by the request validation layer.

Data flow:

```text
ChangePasswordRequest::validated()
        │
        ▼
ChangePasswordData
        │
        ▼
AuthenticationService::changePassword()
        │
        ├── Verify current password
        ├── Hash new password
        └── Persist hashed password
```

The DTO must never:

* hash the password;
* verify the current password;
* persist the password;
* revoke tokens;
* expose password values through an API response.

---

# Request Validation

Form Requests validate and normalize incoming HTTP payloads before data reaches the controller and service layers.

Authentication Requests extend the shared request foundation:

```text
App\Http\Requests\BaseRequest
```

Requests are responsible for:

* request authorization;
* payload validation;
* input normalization when implemented;
* validation messages;
* returning validated data.

Requests must not:

* contain persistence logic;
* call repositories;
* execute business workflows;
* hash passwords;
* manage access tokens;
* generate business response DTOs.

---

## LoginRequest

File:

```text
app/Modules/Authentication/Requests/LoginRequest.php
```

Purpose:

Validates credentials submitted to:

```text
POST /api/auth/login
```

Validated fields:

| Field    | Description               |
| -------- | ------------------------- |
| email    | User email address.       |
| password | User plain-text password. |

Responsibilities:

* ensure the email field is present;
* validate the email according to the implemented email rule;
* ensure the password field is present;
* return validated credentials for `LoginData`.

The request does not determine whether:

* the account exists;
* the password is correct;
* the account can authenticate.

Those decisions remain in `AuthenticationService::login()`.

---

## UpdateProfileRequest

File:

```text
app/Modules/Authentication/Requests/UpdateProfileRequest.php
```

Purpose:

Validates profile updates submitted to:

```text
PUT /api/auth/profile
```

Validated fields:

| Field | Rules                                                                             |
| ----- | --------------------------------------------------------------------------------- |
| name  | required, string, maximum 255 characters                                          |
| email | required, string, valid email, maximum 255 characters, unique except current user |

Responsibilities:

* ensure the request belongs to an authenticated `User`;
* validate name and email;
* exclude the current user from the email uniqueness rule;
* normalize supported profile input;
* return only fields permitted by the Profile Management contract.

Normalization currently includes:

```text
name
        → trimmed

email
        → trimmed and converted to lowercase
```

The request intentionally ignores fields such as:

* UUID;
* password;
* role;
* account status;
* email verification timestamp;
* remember token;
* token data.

Only `name` and `email` are available through `validated()`.

---

## ChangePasswordRequest

File:

```text
app/Modules/Authentication/Requests/ChangePasswordRequest.php
```

Purpose:

Validates password change requests submitted to:

```text
PUT /api/auth/password
```

Validated fields:

| Field                 | Rules                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| current_password      | required, string                                                               |
| password              | required, string, minimum length 8, confirmed, different from current_password |
| password_confirmation | Used by the confirmed validation rule.                                         |

Responsibilities:

* ensure the request belongs to an authenticated `User`;
* require the current password input;
* enforce the new password validation policy;
* ensure password confirmation matches;
* ensure the new password differs from the submitted current password.

The request does not verify whether `current_password` matches the stored password hash.

That verification is performed by:

```text
AuthenticationService::changePassword()
```

The request also does not hash the new password.

Hashing remains a Service Layer responsibility.

---

# API Resources

API Resources define the public representation of application data returned to clients.

Resources are responsible for:

* exposing only approved public attributes;
* keeping API response fields consistent;
* preventing accidental model attribute exposure;
* separating application data from JSON representation.

Resources must not:

* contain business logic;
* query the database;
* modify models;
* manage tokens;
* validate requests;
* expose sensitive fields.

---

## AuthenticatedUserResource

File:

```text
app/Modules/Authentication/Resources/AuthenticatedUserResource.php
```

Purpose:

Transforms `AuthenticatedUserData` into the public authenticated user representation.

It is used by:

```text
GET /api/auth/me
PUT /api/auth/profile
```

Current public representation:

```json
{
    "uuid": "...",
    "name": "John Doe",
    "email": "john@example.com"
}
```

Exposed attributes:

| Field | Description             |
| ----- | ----------------------- |
| uuid  | Public user identifier. |
| name  | User display name.      |
| email | User email address.     |

Hidden attributes include:

* internal database ID;
* password;
* password hash;
* remember token;
* personal access token records;
* current access token;
* model relationships;
* internal timestamps unless explicitly added to the public contract.

The same resource is reused by Current User and Profile Management because both endpoints return the same public user representation.

A separate `ProfileResource` is not required.

---

# Resource Decisions by Feature

## Login

Login returns `LoginResponseData`, which contains:

* the plain-text Sanctum token;
* authenticated public user information.

The Login response must follow its existing response contract and must not expose internal user or token attributes.

---

## Current Authenticated User

```text
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
```

---

## Profile Management

```text
AuthenticationService::updateProfile()
        │
        ▼
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
```

Using the same resource guarantees that `/me` and `/profile` expose the same user structure.

---

## Change Password

Change Password does not use an API Resource because:

```text
AuthenticationService::changePassword()
        → void
```

The endpoint does not produce public domain data that requires transformation.

It returns only a standard success response.

A `ChangePasswordResource` would not be appropriate because the endpoint must never return:

* current password;
* new password;
* password confirmation;
* password hash;
* revoked tokens.

---

## Logout

Logout does not use an API Resource because the operation returns no public domain data.

It returns only a standard success response after the current token has been revoked.

---

# Layer Interaction Rules

The following rules are mandatory.

## Request to DTO

Controllers must construct DTOs only from validated request data.

```php
UpdateProfileData::fromArray(
    $request->validated(),
);
```

Raw input must not be forwarded using:

```php
$request->all();
```

---

## DTO to Service

Services receive typed DTOs rather than HTTP Request objects.

Correct:

```text
AuthenticationService::updateProfile(
    User,
    UpdateProfileData
)
```

Incorrect:

```text
AuthenticationService::updateProfile(
    UpdateProfileRequest
)
```

---

## Service to Repository

The service converts DTO data into the persistence input expected by the repository.

Example:

```text
UpdateProfileData
        │
        ▼
toArray()
        │
        ▼
AuthenticationRepository::updateProfile()
```

For Change Password, the service passes only the hashed password:

```text
ChangePasswordData::password
        │
        ▼
Hash New Password
        │
        ▼
AuthenticationRepository::updatePassword(
    User,
    hashedPassword
)
```

---

## Service to Resource

Controllers wrap service output with a Resource only when the service returns public application data.

```text
AuthenticatedUserData
        │
        ▼
AuthenticatedUserResource
```

Operations returning `void` do not require a Resource.

---

# Security Boundaries

The DTO, Request, and Resource layers enforce complementary security boundaries.

```text
Request
        → controls accepted input

DTO
        → controls data transported to business logic

Resource
        → controls data exposed to clients
```

Together, these layers prevent:

* unvalidated input from reaching services;
* mass-assignment of protected attributes;
* HTTP dependencies inside business logic;
* accidental exposure of sensitive model data;
* passwords or token hashes appearing in API responses.

These boundaries must remain unchanged for all future Authentication features.

---

# Repository and Service Documentation

This section documents the persistence and business logic layers used by the Authentication module.

The Repository Layer encapsulates database operations, while the Service Layer coordinates authentication workflows, applies business rules, manages password security, and controls the personal access token lifecycle.

The separation between these layers is mandatory and follows the project's accepted Architecture Decision Records.

---

# Repository Layer

The Repository Layer is responsible for all persistence operations related to Authentication.

The Authentication module uses:

```text
AuthenticationRepositoryInterface
        │
        ▼
AuthenticationRepository
        │
        ▼
User Model
```

The service depends on the repository contract rather than the concrete repository implementation.

Dependency Injection resolves:

```text
AuthenticationRepositoryInterface
        → AuthenticationRepository
```

---

## AuthenticationRepositoryInterface

File:

```text
app/Modules/Authentication/Contracts/AuthenticationRepositoryInterface.php
```

Purpose:

Defines the persistence operations required by the Authentication Service.

Current operations:

```php
public function findByEmail(string $email): ?User;

public function updateProfile(
    User $user,
    array $attributes,
): User;

public function updatePassword(
    User $user,
    string $hashedPassword,
): User;
```

The interface acts as the stable contract between the Service Layer and Repository Layer.

The service must not depend directly on:

```text
AuthenticationRepository
```

It must depend on:

```text
AuthenticationRepositoryInterface
```

---

## AuthenticationRepository

File:

```text
app/Modules/Authentication/Repositories/AuthenticationRepository.php
```

Purpose:

Implements the persistence operations defined by `AuthenticationRepositoryInterface`.

The repository follows the shared repository foundation:

```text
AuthenticationRepository
        │
        ▼
BaseRepository
```

The repository must only contain persistence logic.

It must not:

* validate HTTP requests;
* verify passwords;
* hash passwords;
* create DTOs;
* create API responses;
* manage authentication guards;
* manage personal access tokens;
* contain business decisions.

---

## findByEmail()

Signature:

```php
public function findByEmail(string $email): ?User;
```

Purpose:

Retrieves a user by email address for the Login flow.

Data flow:

```text
AuthenticationService::login()
        │
        ▼
AuthenticationRepository::findByEmail()
        │
        ▼
User|null
```

The method returns:

```text
User
```

when a matching account exists, or:

```text
null
```

when no user is found.

The repository does not decide whether missing users should produce an authentication error. That decision belongs to `AuthenticationService::login()`.

---

## updateProfile()

Signature:

```php
public function updateProfile(
    User $user,
    array $attributes,
): User;
```

Purpose:

Persists the authenticated user's profile changes.

Expected persistence attributes:

```text
name
email
```

Data flow:

```text
UpdateProfileData
        │
        ▼
AuthenticationService::updateProfile()
        │
        ▼
UpdateProfileData::toArray()
        │
        ▼
AuthenticationRepository::updateProfile()
        │
        ▼
Updated User
```

The repository:

* fills the permitted attributes;
* saves the user;
* refreshes the model;
* returns the updated `User`.

The repository does not determine which request fields are allowed. Input boundaries are already enforced by:

```text
UpdateProfileRequest
        +
UpdateProfileData
```

---

## updatePassword()

Signature:

```php
public function updatePassword(
    User $user,
    string $hashedPassword,
): User;
```

Purpose:

Persists the authenticated user's new password hash.

Data flow:

```text
AuthenticationService::changePassword()
        │
        ├── Verify current password
        ├── Hash new password
        │
        ▼
AuthenticationRepository::updatePassword()
        │
        ▼
Updated User
```

The repository receives only:

```text
hashedPassword
```

It must never receive responsibility for:

* validating the current password;
* comparing password hashes;
* creating the password hash;
* revoking access tokens.

Password verification and hashing remain Service Layer responsibilities.

---

# Service Layer

The Service Layer contains the Authentication module's application and business logic.

The primary service is:

```text
AuthenticationService
```

Token lifecycle operations are delegated to:

```text
AuthenticationTokenManager
```

The service layer coordinates:

* repository operations;
* password verification;
* password hashing;
* authenticated user mapping;
* login response construction;
* personal access token creation;
* token revocation;
* business exception handling.

---

## AuthenticationServiceInterface

File:

```text
app/Modules/Authentication/Contracts/AuthenticationServiceInterface.php
```

Purpose:

Defines the public application operations supported by the Authentication module.

Current operations:

```php
public function login(LoginData $data): LoginResponseData;

public function logout(User $user): void;

public function me(User $user): AuthenticatedUserData;

public function updateProfile(
    User $user,
    UpdateProfileData $data,
): AuthenticatedUserData;

public function changePassword(
    User $user,
    ChangePasswordData $data,
): void;
```

The controller layer depends on this contract rather than the concrete service.

Dependency Injection resolves:

```text
AuthenticationServiceInterface
        → AuthenticationService
```

---

## AuthenticationService

File:

```text
app/Modules/Authentication/Services/AuthenticationService.php
```

Purpose:

Implements all Authentication business workflows.

The service follows the shared service foundation:

```text
AuthenticationService
        │
        ▼
BaseService
```

The service receives its dependencies through constructor injection.

Primary dependencies:

```text
AuthenticationRepositoryInterface
AuthenticationTokenManagerInterface
```

The service must not:

* receive HTTP Request objects;
* return `JsonResponse`;
* create API Resources;
* perform route handling;
* query Eloquent models directly when repository support exists;
* expose passwords or token hashes.

---

## login()

Signature:

```php
public function login(
    LoginData $data,
): LoginResponseData;
```

Purpose:

Authenticates a user and creates a personal access token.

Business flow:

```text
LoginData
        │
        ▼
AuthenticationRepository::findByEmail()
        │
        ▼
Verify User Exists
        │
        ▼
Verify Password
        │
        ▼
AuthenticationTokenManager::create()
        │
        ▼
LoginResponseData
```

Responsibilities:

* retrieve the user by email;
* prevent account enumeration;
* verify the submitted password;
* reject invalid credentials;
* create a Sanctum personal access token;
* return login response data.

Invalid credentials are represented through:

```text
InvalidCredentialsException
```

A failed login must not create a personal access token.

---

## logout()

Signature:

```php
public function logout(User $user): void;
```

Purpose:

Logs out the current session by revoking only the current access token.

Business flow:

```text
Authenticated User
        │
        ▼
AuthenticationService::logout()
        │
        ▼
AuthenticationTokenManager::revokeCurrent()
```

Token policy:

```text
Current token
        → revoked

Other tokens owned by the same user
        → remain active
```

The Logout flow must not invoke:

```text
revokeAll()
```

---

## me()

Signature:

```php
public function me(
    User $user,
): AuthenticatedUserData;
```

Purpose:

Transforms the authenticated `User` into the public authenticated user DTO.

Business flow:

```text
Authenticated User
        │
        ▼
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
```

The official operation name is:

```text
me()
```

The module does not use:

```text
getAuthenticatedUser()
```

The method must not expose internal or sensitive user attributes.

---

## updateProfile()

Signature:

```php
public function updateProfile(
    User $user,
    UpdateProfileData $data,
): AuthenticatedUserData;
```

Purpose:

Coordinates the authenticated user's profile update.

Business flow:

```text
Authenticated User
        +
UpdateProfileData
        │
        ▼
AuthenticationRepository::updateProfile()
        │
        ▼
Updated User
        │
        ▼
AuthenticationService::me()
        │
        ▼
AuthenticatedUserData
```

Responsibilities:

* accept typed profile data;
* convert the DTO into repository input;
* delegate persistence to the repository;
* map the updated user through `me()`;
* return `AuthenticatedUserData`.

Token policy:

```text
Profile update
        → does not revoke tokens
```

The current token and secondary tokens remain active.

---

## changePassword()

Signature:

```php
public function changePassword(
    User $user,
    ChangePasswordData $data,
): void;
```

Purpose:

Verifies and updates the authenticated user's password.

Business flow:

```text
Authenticated User
        +
ChangePasswordData
        │
        ▼
Verify Current Password
        │
        ▼
Hash New Password
        │
        ▼
AuthenticationRepository::updatePassword()
        │
        ▼
AuthenticationTokenManager::revokeAll()
```

Responsibilities:

* verify `currentPassword` against the stored password hash;
* reject an incorrect current password;
* hash the new password;
* delegate persistence to the repository;
* revoke all personal access tokens after successful persistence.

If current password verification fails:

```text
Repository
        → not called

Password
        → unchanged

Tokens
        → remain active
```

If the password is changed successfully:

```text
Current token
        → revoked

Secondary tokens
        → revoked
```

The user must log in again using the new password.

---

# Authentication Token Manager

Token lifecycle operations are separated from the primary Authentication Service through a dedicated contract and implementation.

```text
AuthenticationTokenManagerInterface
        │
        ▼
AuthenticationTokenManager
        │
        ▼
Laravel Sanctum
```

---

## AuthenticationTokenManagerInterface

File:

```text
app/Modules/Authentication/Contracts/AuthenticationTokenManagerInterface.php
```

Current contract:

```php
public function create(User $user): string;

public function revokeCurrent(User $user): void;

public function revokeAll(User $user): void;
```

The method names and signatures are frozen and must be used exactly as defined.

Alternative names such as the following are not part of the contract:

```text
revokeCurrentToken()
revokeAllTokens()
```

---

## AuthenticationTokenManager

File:

```text
app/Modules/Authentication/Services/AuthenticationTokenManager.php
```

Purpose:

Encapsulates all Laravel Sanctum personal access token operations.

It is responsible for:

* creating personal access tokens;
* revoking the current token;
* revoking all tokens owned by a user.

It must not:

* verify login credentials;
* update user profiles;
* update passwords;
* create API responses;
* perform request validation.

---

## create()

Signature:

```php
public function create(User $user): string;
```

Used by:

```text
AuthenticationService::login()
```

Behavior:

```text
User
        │
        ▼
Create Sanctum Personal Access Token
        │
        ├── Store Hashed Token
        └── Return Plain-Text Token Once
```

The plain-text token is returned only when the token is created.

The database stores only the token hash.

---

## revokeCurrent()

Signature:

```php
public function revokeCurrent(User $user): void;
```

Used by:

```text
AuthenticationService::logout()
```

Behavior:

```text
Delete only the token associated with the current authenticated request
```

Other tokens owned by the same user remain active.

---

## revokeAll()

Signature:

```php
public function revokeAll(User $user): void;
```

Used by:

```text
AuthenticationService::changePassword()
```

Behavior:

```text
Delete every personal access token owned by the user
```

Tokens belonging to other users remain unaffected.

---

# Repository and Service Interaction

The Service Layer is the only application layer allowed to coordinate repository and token manager operations.

```text
Controller
        │
        ▼
AuthenticationServiceInterface
        │
        ▼
AuthenticationService
        │
        ├── AuthenticationRepositoryInterface
        └── AuthenticationTokenManagerInterface
```

The controller must never call:

```text
AuthenticationRepository
AuthenticationTokenManager
```

directly.

---

# Dependency Injection Bindings

The module registers contract-to-implementation bindings through:

```text
AuthenticationServiceProvider
```

Required bindings include:

```text
AuthenticationRepositoryInterface
        → AuthenticationRepository

AuthenticationServiceInterface
        → AuthenticationService

AuthenticationTokenManagerInterface
        → AuthenticationTokenManager
```

These bindings allow:

* controllers to depend on service contracts;
* services to depend on repository and token manager contracts;
* concrete implementations to remain replaceable without changing consumers;
* dependencies to remain testable and explicit.

No controller or service should instantiate dependencies manually using:

```php
new AuthenticationRepository();
```

or:

```php
new AuthenticationTokenManager();
```

---

# Transaction and Persistence Boundaries

Repository methods currently perform focused persistence operations on the `User` model.

The current Authentication flows do not introduce a new transaction mechanism.

Any transaction behavior must follow the existing `BaseService` and project conventions.

The module must not introduce an alternative transaction abstraction.

Password changes follow this sequence:

```text
Verify Password
        │
        ▼
Hash Password
        │
        ▼
Persist Password
        │
        ▼
Revoke All Tokens
```

Tokens must not be revoked before the password has been successfully persisted.

---

# Error and State Safety

The service layer must preserve consistent state when an operation fails.

## Failed Login

```text
User state
        → unchanged

Tokens
        → no token created
```

## Failed Profile Update

```text
User profile
        → unchanged

Tokens
        → remain active
```

## Failed Password Change

```text
Password
        → unchanged

Current token
        → remains active

Secondary tokens
        → remain active
```

These guarantees are covered by integration, security, and regression tests.

---

# Mandatory Layer Rules

The following rules are mandatory for all current and future Authentication operations.

## Repository Rules

Repositories must:

* contain persistence logic only;
* return models or persistence results;
* remain independent from HTTP requests;
* never perform password verification;
* never manage tokens;
* never return API responses.

## Service Rules

Services must:

* receive typed DTOs;
* coordinate business workflows;
* use repository contracts;
* use token manager contracts;
* apply password verification and hashing;
* throw business exceptions;
* remain independent from controllers and HTTP responses.

## Controller Rules

Controllers must:

* depend on `AuthenticationServiceInterface`;
* build DTOs from validated request data;
* never access repositories directly;
* never manage password hashes;
* never manage tokens directly.

These rules are part of the module's frozen architecture and must not be bypassed.

---

# Exception Documentation

This section documents the business exceptions defined within the Authentication module and their role in the project's centralized exception handling architecture.

Authentication exceptions represent expected business failures. They must not be handled as generic server errors and must not expose internal implementation details, stack traces, password hashes, token hashes, or account-sensitive information.

---

# Exception Architecture

The Authentication module follows the project's Business Exception architecture.

```text
Authentication Service
        │
        ▼
Authentication Exception
        │
        ▼
Global Exception Handler
        │
        ▼
Standardized JSON Error Response
```

Authentication business exceptions are located in:

```text
app/Modules/Authentication/Exceptions
```

They integrate with the shared exception foundation:

```text
AuthenticationException
        │
        ▼
BusinessException
```

The exact inheritance structure must remain consistent with the implemented exception classes.

---

# Exception Responsibilities

Authentication exceptions are responsible for:

* representing predictable authentication failures;
* separating business failures from infrastructure failures;
* providing consistent HTTP status codes;
* providing safe client-facing messages;
* preventing controllers from manually constructing error responses;
* keeping authentication services independent from HTTP response creation.

Authentication exceptions must not:

* query the database;
* modify user state;
* revoke tokens;
* log passwords or tokens;
* expose stack traces to API clients;
* return raw Eloquent models;
* perform request validation.

---

# AuthenticationException

File:

```text
app/Modules/Authentication/Exceptions/AuthenticationException.php
```

Purpose:

`AuthenticationException` acts as the Authentication module's base business exception for authentication-related failures.

It provides a common exception boundary for specialized exceptions such as invalid credentials, invalid tokens, disabled accounts, locked accounts, unverified email addresses, and expired passwords.

Conceptual hierarchy:

```text
BusinessException
        │
        ▼
AuthenticationException
        │
        ├── InvalidCredentialsException
        ├── InvalidTokenException
        ├── AccountDisabledException
        ├── AccountLockedException
        ├── EmailNotVerifiedException
        └── PasswordExpiredException
```

The hierarchy shown above must follow the actual inheritance implemented in the project.

---

# InvalidCredentialsException

File:

```text
app/Modules/Authentication/Exceptions/InvalidCredentialsException.php
```

Purpose:

Represents failed credential verification.

Currently used by:

* Login;
* Change Password current-password verification.

Typical triggers:

```text
Login
        → user not found

Login
        → password does not match

Change Password
        → current password does not match
```

Expected behavior:

* return an authentication failure response;
* avoid revealing whether the account exists;
* avoid revealing which credential was incorrect;
* create no token during failed login;
* preserve the existing password during failed password change;
* preserve active tokens during failed password change.

Safe client-facing message:

```text
Invalid credentials.
```

The exception constructor must be called according to its implemented signature.

If its constructor accepts no arguments, consumers must use:

```php
throw new InvalidCredentialsException();
```

and must not pass a custom message.

---

# InvalidTokenException

File:

```text
app/Modules/Authentication/Exceptions/InvalidTokenException.php
```

Purpose:

Represents an invalid, malformed, expired, or otherwise unusable authentication token when the module explicitly needs to raise a token-related business failure.

Possible scenarios include:

* token validation failure;
* unsupported token state;
* token lifecycle violations.

Sanctum middleware may reject invalid or revoked bearer tokens before this exception is needed.

Therefore, the existence of `InvalidTokenException` does not mean every invalid-token response is generated directly by this exception.

---

# AccountDisabledException

File:

```text
app/Modules/Authentication/Exceptions/AccountDisabledException.php
```

Purpose:

Represents an authentication attempt by an account that has been disabled.

Expected behavior when the corresponding business rule is active:

* login is rejected;
* no token is created;
* account data is not modified;
* client receives a safe business error response.

This exception must only be documented as active runtime behavior when `AuthenticationService::login()` actually evaluates account status and throws it.

---

# AccountLockedException

File:

```text
app/Modules/Authentication/Exceptions/AccountLockedException.php
```

Purpose:

Represents an authentication attempt by an account that is currently locked.

Expected behavior when activated:

* authentication is denied;
* no token is created;
* the response does not expose internal lock metadata unless explicitly included in the public contract.

The current presence of the exception class does not automatically confirm that account-locking rules are active.

---

# EmailNotVerifiedException

File:

```text
app/Modules/Authentication/Exceptions/EmailNotVerifiedException.php
```

Purpose:

Represents authentication denial for an account whose email address has not been verified.

Email Verification is currently deferred.

Therefore:

* this exception may exist as part of the Authentication foundation;
* it must not be described as active login behavior unless the service currently throws it;
* no active email-verification endpoint is documented;
* no verification workflow is implied by the exception's existence.

---

# PasswordExpiredException

File:

```text
app/Modules/Authentication/Exceptions/PasswordExpiredException.php
```

Purpose:

Represents authentication denial when an account password is considered expired.

Password expiration is not part of the currently documented active feature set unless the Login service explicitly enforces it.

The exception may remain available as a future-compatible business exception without changing the existing architecture.

---

# Exception Usage by Feature

## Login

The Login flow currently uses business exceptions to represent authentication failure.

```text
AuthenticationRepository::findByEmail()
        │
        ├── User found
        │       ▼
        │   Verify password
        │
        └── User not found
                ▼
InvalidCredentialsException
```

Invalid email ownership and incorrect password must produce the same public failure behavior.

This protects against account enumeration.

---

## Logout

Logout normally completes without a custom Authentication business exception when a valid Sanctum-authenticated user and current token are available.

Unauthenticated requests are rejected by:

```text
auth:sanctum
```

before the controller executes.

If token-specific business failures are explicitly implemented later, they must use the existing exception architecture rather than controller-level error responses.

---

## Current Authenticated User

The `/api/auth/me` endpoint relies on:

```text
auth:sanctum
```

to reject unauthenticated, invalid-token, and revoked-token requests.

The controller must not manually throw generic HTTP exceptions for normal authentication failures when middleware already owns that responsibility.

---

## Profile Management

Profile validation failures are handled by `UpdateProfileRequest` and normally produce:

```text
422 Unprocessable Entity
```

Examples:

* required name missing;
* required email missing;
* invalid email format;
* email already owned by another user.

These are validation failures, not Authentication business exceptions.

Unauthenticated profile requests are rejected by Sanctum middleware.

---

## Change Password

Change Password uses:

```text
InvalidCredentialsException
```

when the submitted current password does not match the authenticated user's stored password hash.

Failure behavior:

```text
Password
        → unchanged

Repository update
        → not executed

Current token
        → remains active

Secondary tokens
        → remain active
```

Validation failures such as confirmation mismatch or insufficient password length remain Request Layer failures and produce validation responses instead of business exceptions.

---

# Validation Errors vs Business Exceptions

Validation errors and business exceptions serve different purposes.

## Validation Error

Produced by:

```text
LoginRequest
UpdateProfileRequest
ChangePasswordRequest
```

Examples:

* missing email;
* malformed email;
* missing password;
* duplicate profile email;
* password confirmation mismatch;
* password below the required minimum length.

Typical status:

```text
422 Unprocessable Entity
```

## Business Exception

Produced by:

```text
AuthenticationService
```

Examples:

* invalid credentials;
* incorrect current password;
* disabled account when enforced;
* locked account when enforced.

Typical status depends on the exception's configured contract.

Authentication failures commonly use:

```text
401 Unauthorized
```

The exact status must follow the implemented `BusinessException` configuration.

---

# Exception Rendering

Authentication exceptions are rendered through the project's centralized exception handling configuration.

The renderer is responsible for converting exceptions into safe JSON responses.

Conceptual response:

```json
{
    "success": false,
    "message": "Invalid credentials."
}
```

The actual response envelope must follow the shared exception response contract implemented by the project.

Controllers must not duplicate exception rendering with logic such as:

```php
try {
    // Authentication operation
} catch (InvalidCredentialsException $exception) {
    return response()->json(...);
}
```

Business exceptions should propagate to the centralized handler.

---

# Exception Registration

The project must ensure Authentication business exceptions are recognized by the global exception handling layer.

Depending on the Laravel application structure, registration may be configured through:

```text
bootstrap/app.php
```

or the project's existing exception handler foundation.

The final registration must ensure that expected Authentication failures do not become:

```text
500 Internal Server Error
```

For example:

```text
InvalidCredentialsException
        → expected authentication response

Not:

InvalidCredentialsException
        → unhandled 500 response
```

The exception registration mechanism must not be duplicated across controllers.

---

# Security Requirements

Authentication exception responses must not reveal:

* whether an email address exists;
* stored password hashes;
* submitted passwords;
* token hashes;
* token database identifiers;
* stack traces;
* source file paths;
* SQL queries;
* internal database IDs;
* private account metadata.

Production responses must remain safe even when detailed exception information is available in server logs.

---

# Logging Requirements

Authentication exceptions may be logged according to the project's centralized logging policy.

Logs must never include:

* plain-text passwords;
* password confirmation values;
* bearer tokens;
* Sanctum plain-text tokens;
* token hashes;
* remember tokens.

Safe context may include:

* request ID;
* exception class;
* endpoint;
* HTTP method;
* authenticated public UUID when available;
* timestamp.

Logging behavior must follow the existing Logging Foundation and must not introduce a separate Authentication logging architecture.

---

# Active and Reserved Exceptions

The Authentication module distinguishes between exceptions that are actively used and exceptions reserved for supported future rules.

## Confirmed Active

Based on the current implemented flows:

* `InvalidCredentialsException`

## Available but Runtime Use Must Be Verified

* `InvalidTokenException`
* `AccountDisabledException`
* `AccountLockedException`
* `EmailNotVerifiedException`
* `PasswordExpiredException`

An exception class must not be documented as an active business rule unless the corresponding service implementation currently throws it.

This distinction prevents documentation from overstating the current feature set.

---

# Testing Coverage

Exception behavior is covered by Authentication tests, including:

* invalid password login;
* unknown email login;
* identical public response for existing and unknown accounts;
* incorrect current password;
* validation failures;
* unauthenticated protected endpoint access;
* invalid access token;
* revoked access token;
* failed password change state preservation.

The test suite verifies that:

```text
Expected business failure
        → safe client response

Unexpected system failure
        → not silently treated as a business error
```

---

# Mandatory Exception Rules

The following rules are mandatory.

1. Services throw business exceptions.

2. Controllers do not manually translate Authentication business exceptions.

3. Requests produce validation errors, not Authentication business exceptions.

4. Repositories do not throw HTTP-specific exceptions.

5. Exception responses do not expose sensitive data.

6. Invalid login email and invalid login password use indistinguishable public responses.

7. Failed login creates no token.

8. Failed Change Password changes neither password nor token state.

9. Exception constructor signatures must be respected exactly.

10. Exception classes that are not actively thrown must not be described as completed business behavior.

These rules are part of the frozen Authentication architecture and must remain consistent in future extensions.

---

# Testing Documentation

This section documents the complete testing strategy for the Authentication module.

Authentication testing follows the project's testing philosophy:

* production-oriented;
* feature-driven;
* integration-focused;
* security-aware;
* regression-safe.

Every Authentication feature implemented from Phase 3.1 through Phase 3.13 is covered by automated Feature Tests.

---

# Testing Objectives

The Authentication test suite ensures that:

* every public Authentication endpoint behaves correctly;
* request validation is enforced;
* business rules remain consistent;
* security requirements are preserved;
* token lifecycle behaves correctly;
* future changes do not introduce regressions.

Testing is considered part of the module architecture rather than an optional activity.

---

# Test Directory

Authentication Feature Tests are located in:

```text
tests/
└── Feature/
    └── Modules/
        └── Authentication/
            ├── AuthenticationTokenLifecycleTest.php
            ├── ChangePasswordTest.php
            ├── LoginTest.php
            ├── LogoutTest.php
            ├── MeTest.php
            └── UpdateProfileTest.php
```

Each file validates one business capability only.

---

# Test Coverage Matrix

| Feature                    | Test File                        | Status |
| -------------------------- | -------------------------------- | ------ |
| Login                      | LoginTest                        | ✅      |
| Logout                     | LogoutTest                       | ✅      |
| Current Authenticated User | MeTest                           | ✅      |
| Token Lifecycle            | AuthenticationTokenLifecycleTest | ✅      |
| Profile Management         | UpdateProfileTest                | ✅      |
| Change Password            | ChangePasswordTest               | ✅      |

Together these files represent the complete Authentication Feature Test Suite.

---

# Login Testing

Covered by:

```text
LoginTest.php
```

Verified scenarios include:

* successful login;
* required email validation;
* required password validation;
* invalid email format;
* incorrect password;
* unknown email;
* email normalization;
* sensitive data protection.

The Login tests verify that:

```text
Valid credentials
        │
        ▼
Token created
```

while:

```text
Invalid credentials
        │
        ▼
No token created
```

The suite also verifies that identical public responses are returned for:

* unknown email;
* incorrect password.

This prevents account enumeration.

---

# Logout Testing

Covered by:

```text
LogoutTest.php
```

Verified scenarios include:

* authenticated logout;
* unauthenticated logout;
* current token revocation;
* revoked token reuse prevention;
* other user tokens remain valid;
* response confidentiality.

The Logout suite confirms the following policy:

```text
Current Token
        → Revoked

Other Tokens
        → Active
```

---

# Current User Testing

Covered by:

```text
MeTest.php
```

Verified scenarios include:

* authenticated access;
* unauthenticated access;
* returned public fields;
* hidden internal attributes;
* authenticated user consistency.

The tests verify that only approved fields are exposed:

```text
uuid
name
email
```

Internal model attributes remain hidden.

---

# Token Lifecycle Testing

Covered by:

```text
AuthenticationTokenLifecycleTest.php
```

Verified scenarios include:

* token creation;
* current token revocation;
* revoke-all operation;
* token ownership isolation;
* token invalidation after revocation;
* multiple device behavior.

The suite validates:

```text
Login
        │
        ▼
Token Created
```

```text
Logout
        │
        ▼
Current Token Deleted
```

```text
Change Password
        │
        ▼
All Tokens Deleted
```

---

# Profile Management Testing

Covered by:

```text
UpdateProfileTest.php
```

Verified scenarios include:

* successful profile update;
* validation failures;
* duplicate email rejection;
* current email acceptance;
* unauthorized access;
* unchanged token lifecycle;
* response correctness.

The suite verifies:

```text
Profile Updated
        │
        ▼
Token Remains Valid
```

Profile updates must never revoke access tokens.

---

# Change Password Testing

Covered by:

```text
ChangePasswordTest.php
```

Verified scenarios include:

* successful password change;
* incorrect current password;
* password confirmation validation;
* password validation rules;
* unauthenticated requests;
* password hashing;
* revoke-all behavior;
* login with new password;
* rejection of old password.

The suite confirms:

```text
Password Changed
        │
        ▼
All Tokens Revoked
```

and:

```text
Incorrect Current Password
        │
        ▼
Password Unchanged
```

---

# Cross Feature Integration Testing

Cross Feature Integration Testing validates interaction between multiple Authentication features.

Verified workflow:

```text
Login
        │
        ▼
Me
        │
        ▼
Update Profile
        │
        ▼
Me
        │
        ▼
Change Password
        │
        ▼
Login Again
```

The integration suite verifies that state transitions remain consistent across the complete Authentication lifecycle.

---

# Authentication Security Testing

Security testing validates that Authentication behavior complies with the module's security requirements.

Covered areas include:

* credential verification;
* account enumeration protection;
* password confidentiality;
* token confidentiality;
* token revocation;
* authorization middleware;
* unauthorized request rejection;
* protected endpoint enforcement.

Security tests verify that:

* passwords never appear in responses;
* token hashes never appear in responses;
* internal identifiers remain hidden;
* revoked tokens cannot be reused.

---

# Authentication Regression Testing

Regression testing ensures that completed Authentication features remain stable after future development.

Regression scope includes:

* login;
* logout;
* authenticated user retrieval;
* profile management;
* password change;
* token lifecycle.

Every future Authentication change must preserve the behavior verified by the existing Feature Test Suite.

---

# Test Environment

Authentication tests execute in an isolated testing environment.

Typical environment characteristics include:

* dedicated testing database;
* automatic database refresh;
* isolated HTTP requests;
* independent test execution.

Tests must never depend on:

* production data;
* execution order;
* previous test state;
* manually created records.

Every test must be deterministic.

---

# Test Data Strategy

Authentication tests create only the data required for each scenario.

Typical test data includes:

* authenticated user;
* secondary authenticated user;
* personal access tokens;
* updated profile values;
* new passwords.

Factories are used to produce isolated test data.

Tests must not share mutable state.

---

# Assertions

The Authentication suite validates multiple categories of assertions.

## HTTP Assertions

Examples:

* successful response;
* unauthorized response;
* validation response;
* JSON structure.

---

## Database Assertions

Examples:

* user persisted;
* profile updated;
* password changed;
* password unchanged;
* token created;
* token deleted.

---

## Security Assertions

Examples:

* password not exposed;
* token not exposed;
* internal ID not exposed;
* hidden attributes remain hidden.

---

## Business Assertions

Examples:

* profile updated;
* duplicate email rejected;
* password unchanged after failure;
* token lifecycle preserved;
* revoke-all executed correctly.

---

# Failure State Verification

Authentication tests verify that failures do not modify application state.

Examples include:

```text
Failed Login
        │
        ▼
No Token Created
```

```text
Failed Profile Update
        │
        ▼
Profile Unchanged
```

```text
Failed Password Change
        │
        ▼
Password Unchanged
```

```text
Failed Password Change
        │
        ▼
Tokens Remain Active
```

These checks prevent partial state mutations.

---

# Continuous Verification

Whenever a new Authentication feature is completed:

1. Existing Authentication tests must continue to pass.
2. New feature tests must be added.
3. Regression behavior must remain unchanged.
4. Existing business contracts must remain valid.

Authentication development is considered complete only when the full Authentication Feature Test Suite passes successfully.

---

# Current Test Coverage

The Authentication module currently provides automated coverage for:

| Category                  | Coverage |
| ------------------------- | -------- |
| Login                     | ✅        |
| Logout                    | ✅        |
| Current User              | ✅        |
| Profile Management        | ✅        |
| Change Password           | ✅        |
| Token Lifecycle           | ✅        |
| Request Validation        | ✅        |
| Security Rules            | ✅        |
| Cross Feature Integration | ✅        |
| Regression                | ✅        |

This represents the complete implemented Authentication feature set.

Deferred features such as:

* Forgot Password;
* Reset Password;
* Email Verification;

are intentionally excluded from the current test suite because they are outside the implemented roadmap.

---

# Mandatory Testing Rules

The following rules are mandatory.

1. Every Authentication feature must have Feature Tests.
2. New Authentication features must not break existing tests.
3. Tests must remain isolated and repeatable.
4. Tests must verify both success and failure scenarios.
5. Security behavior must be validated explicitly.
6. Regression tests must be executed after every Authentication change.
7. Feature Tests are the authoritative verification of Authentication behavior.
8. Deferred features must not be documented as tested.
9. Test behavior must remain consistent with the frozen Authentication architecture.
10. Production behavior and documented behavior must remain synchronized.

---

# Module Status & Future Extension

This section defines the current implementation status of the Authentication module and establishes the official guidelines for extending it in future development phases.

The Authentication module is considered a stable production-ready module within the current project roadmap.

Future work must extend the existing architecture rather than redesign it.

---

# Current Module Status

Current implementation status:

| Category                | Status      |
| ----------------------- | ----------- |
| Architecture Foundation | ✅ Completed |
| Repository Pattern      | ✅ Completed |
| Service Layer           | ✅ Completed |
| DTO Layer               | ✅ Completed |
| Request Validation      | ✅ Completed |
| API Resource            | ✅ Completed |
| Dependency Injection    | ✅ Completed |
| Business Exceptions     | ✅ Completed |
| Authentication Testing  | ✅ Completed |
| Documentation           | ✅ Completed |

The Authentication module is now considered functionally complete for the implemented roadmap.

---

# Implemented Features

The following Authentication capabilities are currently available.

## Login

Status:

```text
Completed
```

Capabilities:

* credential authentication;
* email normalization;
* Sanctum token creation;
* invalid credential protection;
* account enumeration protection.

---

## Logout

Status:

```text
Completed
```

Capabilities:

* revoke current access token;
* preserve remaining active tokens;
* authenticated access only.

---

## Current Authenticated User

Status:

```text
Completed
```

Capabilities:

* retrieve authenticated user;
* expose public user data only;
* protected by Sanctum middleware.

---

## Profile Management

Status:

```text
Completed
```

Capabilities:

* update profile;
* unique email validation;
* authenticated access;
* token preservation.

---

## Change Password

Status:

```text
Completed
```

Capabilities:

* current password verification;
* secure password hashing;
* revoke all active personal access tokens;
* force re-authentication.

---

## Token Lifecycle

Status:

```text
Completed
```

Capabilities:

* create token;
* revoke current token;
* revoke all tokens.

---

## Authentication Test Suite

Status:

```text
Completed
```

Coverage includes:

* Feature Tests;
* Integration Tests;
* Security Tests;
* Regression Tests.

---

# Deferred Features

The following Authentication capabilities are intentionally deferred and are **not** part of the current implementation.

| Feature            | Status   |
| ------------------ | -------- |
| Forgot Password    | Deferred |
| Reset Password     | Deferred |
| Email Verification | Deferred |

These features were intentionally postponed to prioritize higher-value backend functionality.

Their absence does not indicate an incomplete Authentication implementation.

---

# Stable Public Contracts

The following contracts are considered stable and must remain compatible.

## Repository Contract

```text
AuthenticationRepositoryInterface
```

Current responsibilities:

* findByEmail();
* updateProfile();
* updatePassword().

---

## Service Contract

```text
AuthenticationServiceInterface
```

Current responsibilities:

* login();
* logout();
* me();
* updateProfile();
* changePassword().

The existing public service API must not be renamed without an approved architecture decision.

---

## Token Manager Contract

```text
AuthenticationTokenManagerInterface
```

Current responsibilities:

* create();
* revokeCurrent();
* revokeAll().

These method names are considered part of the module's stable contract.

---

# Stable API Endpoints

The following endpoints are considered stable.

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/login`    |
| POST   | `/api/auth/logout`   |
| GET    | `/api/auth/me`       |
| PUT    | `/api/auth/profile`  |
| PUT    | `/api/auth/password` |

Future implementations should extend the Authentication module without breaking these endpoints.

---

# Extension Principles

Future Authentication features must follow the existing module architecture.

Every new feature should extend:

```text
Request
        │
        ▼
DTO
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Resource
```

Each layer has a single responsibility.

New features must not bypass this flow.

---

# Adding a New Authentication Feature

Every future Authentication feature should follow the same implementation order.

```text
Contract
        │
        ▼
Request
        │
        ▼
DTO
        │
        ▼
Repository Support
        │
        ▼
Service
        │
        ▼
Controller
        │
        ▼
Resource (when applicable)
        │
        ▼
Routes
        │
        ▼
Feature Tests
        │
        ▼
Documentation
```

This sequence maintains consistency with all completed Authentication phases.

---

# Rules for Future DTOs

Future DTOs should:

* represent validated application data;
* remain immutable where possible;
* avoid business logic;
* avoid persistence;
* avoid HTTP dependencies.

DTOs must never:

* access repositories;
* access requests;
* create responses;
* manage tokens.

---

# Rules for Future Requests

Future Form Requests should:

* validate HTTP input;
* normalize request values where appropriate;
* authorize incoming requests;
* return validated data only.

Requests must never:

* execute business logic;
* update models;
* create DTO responses;
* manage authentication state.

---

# Rules for Future Services

Future services should:

* coordinate business workflows;
* consume DTOs;
* use repository contracts;
* use token manager contracts when required;
* throw business exceptions.

Services must never:

* receive raw Request objects;
* generate JSON responses;
* create API Resources;
* perform routing.

---

# Rules for Future Repositories

Repositories should remain responsible for persistence only.

Repositories must never:

* hash passwords;
* verify credentials;
* manage tokens;
* throw HTTP-specific responses;
* perform request validation.

---

# Rules for Future Resources

Resources should expose only public data.

Resources must never expose:

* passwords;
* password hashes;
* remember tokens;
* Sanctum token hashes;
* internal identifiers not included in the public contract.

---

# Rules for Future Exceptions

Future Authentication exceptions should:

* inherit from the module's Authentication exception hierarchy;
* represent business failures;
* integrate with centralized exception handling.

Controllers should continue allowing exceptions to propagate to the global exception layer.

---

# Rules for Future Tests

Every new Authentication feature must include:

* Feature Tests;
* success scenarios;
* failure scenarios;
* validation scenarios;
* security verification;
* regression verification when applicable.

No feature should be considered complete without automated tests.

---

# Architecture Freeze

The Authentication module inherits the project's Architecture Freeze.

Future development must not introduce:

* CQRS;
* Event Sourcing;
* Hexagonal Architecture;
* Clean Architecture restructuring;
* DDD restructuring;
* repository removal;
* service removal;
* DTO removal;
* request removal;
* resource removal.

The current architecture is considered final.

---

# Roadmap Freeze

Authentication development must continue according to the approved roadmap.

Completed phases are immutable.

Future work must continue from the latest unfinished roadmap phase.

Completed implementations must not be restarted or redesigned.

---

# Implementation Freeze

Existing implementations are considered stable.

Future work should:

* extend existing services;
* extend existing repositories;
* extend existing contracts;
* add new feature-specific classes when required.

Future work must not replace completed implementations without an approved architectural decision.

---

# Backward Compatibility

Backward compatibility is a primary requirement.

Future Authentication changes should preserve:

* public endpoints;
* service contracts;
* repository contracts;
* token behavior;
* response structure;
* exception behavior.

Breaking changes should be introduced only through an approved Architecture Decision Record.

---

# Module Maturity

Current maturity assessment:

| Area              | Status |
| ----------------- | ------ |
| Architecture      | Stable |
| Business Layer    | Stable |
| Persistence Layer | Stable |
| Security          | Stable |
| Testing           | Stable |
| Documentation     | Stable |
| Extensibility     | Ready  |

The Authentication module is considered ready to serve as the foundation for future backend modules.

---

# Summary

The Authentication module provides a complete authentication foundation built upon:

* Repository Pattern;
* Service Layer;
* DTO;
* Request Validation;
* API Resource;
* Dependency Injection;
* Business Exceptions;
* Laravel Sanctum;
* Automated Feature Testing.

All implemented functionality is fully documented and verified.

Future development should extend this module while preserving the project's frozen architecture, roadmap, and implementation principles.

This README serves as the official reference for all Authentication-related development within the project.

---

# Release Checklist

This section confirms that the Authentication module has reached its planned implementation milestone and is ready to be committed as a completed roadmap phase.

The checklist below serves as the official release verification for **Phase 3 — Authentication**.

---

# Architecture Verification

| Item                          | Status |
| ----------------------------- | ------ |
| Modular Monolith Architecture | ✅      |
| Repository Pattern            | ✅      |
| Service Layer                 | ✅      |
| DTO Layer                     | ✅      |
| Request Validation            | ✅      |
| API Resource                  | ✅      |
| Dependency Injection          | ✅      |
| Business Exceptions           | ✅      |
| Laravel Sanctum Integration   | ✅      |
| ADR Compliance                | ✅      |

The implemented architecture is fully aligned with the project's Architecture Freeze.

---

# Feature Verification

| Feature                         | Status |
| ------------------------------- | ------ |
| Login                           | ✅      |
| Logout                          | ✅      |
| Current Authenticated User (Me) | ✅      |
| Token Lifecycle Management      | ✅      |
| Profile Management              | ✅      |
| Change Password                 | ✅      |

Deferred features:

* Forgot Password
* Reset Password
* Email Verification

These features are intentionally excluded from this release.

---

# API Verification

Implemented endpoints:

| Method | Endpoint             | Status |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/login`    | ✅      |
| POST   | `/api/auth/logout`   | ✅      |
| GET    | `/api/auth/me`       | ✅      |
| PUT    | `/api/auth/profile`  | ✅      |
| PUT    | `/api/auth/password` | ✅      |

All documented endpoints correspond to implemented functionality.

---

# Layer Verification

| Layer        | Status |
| ------------ | ------ |
| Contracts    | ✅      |
| DTOs         | ✅      |
| Requests     | ✅      |
| Repositories | ✅      |
| Services     | ✅      |
| Controllers  | ✅      |
| Resources    | ✅      |
| Routes       | ✅      |
| Exceptions   | ✅      |

Every implemented Authentication feature follows the same architectural flow.

---

# Testing Verification

Completed automated verification includes:

* Login Feature Tests;
* Logout Feature Tests;
* Current User Feature Tests;
* Token Lifecycle Feature Tests;
* Profile Management Feature Tests;
* Change Password Feature Tests;
* Cross Feature Integration Testing;
* Authentication Security Testing;
* Authentication Regression Testing.

The Authentication module has complete automated coverage for all implemented features.

---

# Documentation Verification

The Authentication README includes documentation for:

* module overview;
* architecture;
* authentication flow;
* API endpoints;
* DTOs;
* requests;
* resources;
* repositories;
* services;
* token manager;
* exceptions;
* testing;
* module status;
* future extension guidelines.

The README is considered the primary reference for Authentication development.

---

# Compliance Verification

The Authentication module complies with the following project principles:

* Architecture Freeze;
* Roadmap Freeze;
* Implementation Freeze;
* Repository Pattern;
* Service Layer;
* DTO-based communication;
* Dependency Injection;
* RESTful API conventions;
* Secure-by-default implementation.

No architectural deviations were introduced during Phase 3.

---

# Release Status

Authentication Module

```text id="9h5p2m"
Status:
READY FOR RELEASE
```

Current roadmap milestone:

```text id="p4s8jq"
PHASE 3 — Authentication
Completed
```

The module is considered stable and ready to become the authentication foundation for subsequent backend modules.

---

# Commit Recommendation

The recommended commit for the completion of the entire Authentication roadmap is:

```text id="d2r7ka"
feat(authentication): complete authentication module foundation
```

This single commit represents the completion of:

* Authentication Foundation;
* User Authentication Integration;
* Login;
* Logout;
* Current Authenticated User;
* Authentication Middleware & Guards;
* Token Lifecycle Management;
* Profile Management;
* Change Password;
* Authentication Feature Testing;
* Authentication Documentation.

Future commits should represent subsequent roadmap phases rather than modifying this completed milestone.

---

# Next Roadmap Phase

After this release, development should continue with the next approved roadmap phase.

Previously deferred Authentication features remain available for future implementation without affecting the completed Authentication foundation.

This concludes the implementation, testing, and documentation activities for **Phase 3 — Authentication**.
