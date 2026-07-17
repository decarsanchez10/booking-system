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
            'upcoming' => Appointment::where('user_id', $userId)->where('status', 'Approved')->where('appointment_date', '>=', now())->count(),
            'completed' => Appointment::where('user_id', $userId)->where('status', 'Completed')->count(),
            'pending' => Appointment::where('user_id', $userId)->where('status', 'Pending')->count(),
            'cancelled' => Appointment::where('user_id', $userId)->where('status', 'Cancelled')->count(),
            'open_tickets' => Ticket::where('user_id', $userId)->whereNotIn('status', ['Resolved', 'Closed'])->count(),
            'recent_appointments' => Appointment::with('agent:id,name')->where('user_id', $userId)->latest('appointment_date')->limit(5)->get(),
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
            'name'       => 'sometimes|required|string|max:255',
            'email'      => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone'      => 'sometimes|nullable|string|max:30',
            'department' => 'sometimes|nullable|string|max:100',
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
        $request->user()->update(['avatar' => asset('storage/'.$path)]);

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
