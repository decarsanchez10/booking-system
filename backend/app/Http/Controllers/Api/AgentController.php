<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AgentController extends Controller
{
    public function publicList()
    {
        return response()->json(
            User::whereHas('roles', fn ($query) => $query->where('name', 'agent'))
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get()
        );
    }

    public function dashboard(Request $request)
    {
        $agentId = $request->user()->id;

        return response()->json([
            'assigned_appointments' => Appointment::where('agent_id', $agentId)->count(),
            'open_tickets' => Ticket::where('agent_id', $agentId)->whereNotIn('status', ['Resolved', 'Closed'])->count(),
            'today_appointments' => Appointment::where('agent_id', $agentId)->whereDate('appointment_date', today())->count(),
            'recent_tickets' => Ticket::where('agent_id', $agentId)->latest()->limit(5)->get(),
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
}
