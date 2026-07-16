<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'appointments' => Appointment::where('user_id', $userId)->count(),
            'upcoming_appointments' => Appointment::where('user_id', $userId)->where('appointment_date', '>=', now())->count(),
            'open_tickets' => Ticket::where('user_id', $userId)->whereNotIn('status', ['Resolved', 'Closed'])->count(),
            'recent_appointments' => Appointment::where('user_id', $userId)->latest('appointment_date')->limit(5)->get(),
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user()->load('roles:id,name'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($data);

        return response()->json($user->fresh()->load('roles:id,name'));
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $path = $request->file('avatar')->store('avatars', 'public');

        return response()->json(['avatar_url' => asset('storage/'.$path)], 201);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        abort_unless(Hash::check($data['current_password'], $request->user()->password), 422, 'Current password is incorrect.');
        $request->user()->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Password updated.']);
    }
}
