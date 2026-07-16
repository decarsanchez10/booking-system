<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $requestedRole = $this->normalizeRequestedRole($request->input('role'));
        $request->merge(['role' => $requestedRole]);

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'nullable|in:user,agent',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $userRole = Role::firstOrCreate(['name' => $requestedRole]);
        $user->roles()->attach($userRole);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid email or password.'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token.'], 500);
        }

        $user = JWTAuth::user();

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ]);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out.']);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Failed to logout.'], 500);
        }
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return response()->json(['token' => $token]);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token cannot be refreshed.'], 401);
        }
    }

    public function me()
    {
        $user = JWTAuth::user();
        return response()->json($this->formatUser($user));
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        Password::sendResetLink($request->only('email'));

        return response()->json(['message' => 'If that email exists, a reset link has been sent.']);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        abort_if($status !== Password::PASSWORD_RESET, 422, __($status));

        return response()->json(['message' => 'Password has been reset successfully.']);
    }

    private function normalizeRequestedRole(?string $role): string
    {
        return match (Str::of($role ?? 'user')->lower()->replace([' ', '-', '_'], '')->toString()) {
            'agent', 'itsupport', 'itsupportagent', 'support', 'supportagent' => 'agent',
            default => 'user',
        };
    }

    private function formatUser(User $user): array
    {
        $user->load('roles');
        $roles = $user->roles->pluck('name')->values();
        $role = collect(['admin', 'agent', 'user'])->first(
            fn (string $roleName) => $roles->contains($roleName),
        ) ?? 'user';

        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $role,
            'roles'      => $roles,
            'avatar_url' => $user->avatar_url ?? null,
            'created_at' => $user->created_at,
        ];
    }
}
