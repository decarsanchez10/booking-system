<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AgentController extends Controller
{
    public function publicList()
    {
        return response()->json(
            User::whereHas('roles', fn ($query) => $query->where('name', 'agent'))
                ->select('id', 'name', 'email', 'specialties', 'avatar')
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
            'completed_sessions' => Appointment::where('agent_id', $agentId)->where('status', 'Completed')->count(),
            'today_queue' => Appointment::with('user:id,name,email,avatar')
                ->where('agent_id', $agentId)
                ->whereDate('appointment_date', today())
                ->whereNotIn('status', ['Completed', 'Cancelled', 'Closed'])
                ->orderBy('appointment_date')
                ->get(),
            'recent_tickets' => Ticket::where('agent_id', $agentId)->latest()->limit(5)->get(),
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user()->load('roles:id,name')->makeVisible('specialties'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'specialties' => 'sometimes|array',
            'specialties.*' => 'string|max:100',
        ]);

        return DB::transaction(function () use ($data, $user) {
            $user->update($data);

            return response()->json($user->fresh()->load('roles:id,name')->makeVisible('specialties'));
        });
    }

    public function updateSpecialties(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'specialties' => 'required|array|min:1',
            'specialties.*' => 'string|max:100',
        ]);

        return DB::transaction(function () use ($data, $user) {
            $user->update(['specialties' => $data['specialties']]);

            return response()->json($user->fresh()->load('roles:id,name')->makeVisible('specialties'));
        });
    }
}
