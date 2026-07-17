<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Role;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'agents' => User::whereHas('roles', fn ($query) => $query->where('name', 'agent'))->count(),
            'appointments' => Appointment::count(),
            'appointments_today' => Appointment::whereDate('appointment_date', today())->count(),
            'open_tickets' => Ticket::whereNotIn('status', ['Resolved', 'Closed'])->count(),
            'active_services' => Service::where('is_active', true)->count(),
        ]);
    }

    public function users()
    {
        return response()->json(
            User::with('roles:id,name')
                ->select('id', 'name', 'email', 'created_at', 'avatar')
                ->latest()
                ->paginate(50)
        );
    }

    public function createUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,agent,user',
        ]);

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->roles()->sync([Role::firstOrCreate(['name' => $data['role']])->id]);

            return response()->json($user->load('roles:id,name'), 201);
        });
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        return DB::transaction(function () use ($data, $user) {
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            return response()->json($user->fresh()->load('roles:id,name'));
        });
    }

    public function deleteUser(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    public function changeRole(Request $request, User $user)
    {
        $data = $request->validate(['role' => 'required|in:admin,agent,user']);
        $user->roles()->sync([Role::firstOrCreate(['name' => $data['role']])->id]);

        return response()->json($user->fresh()->load('roles:id,name'));
    }

    public function reportsOverview()
    {
        return response()->json([
            'appointments_by_status' => Appointment::select('status', DB::raw('count(*) as total'))->groupBy('status')->get(),
            'tickets_by_status' => Ticket::select('status', DB::raw('count(*) as total'))->groupBy('status')->get(),
            'users_by_role' => Role::withCount('users')->get(['id', 'name']),
        ]);
    }

    public function getSettings()
    {
        return response()->json(DB::table('settings')->pluck('value', 'key'));
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate(['settings' => 'required|array']);

        foreach ($data['settings'] as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => (string) $key],
                ['value' => is_scalar($value) ? (string) $value : json_encode($value), 'type' => gettype($value), 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return response()->json(['message' => 'Settings updated.']);
    }

    public function roles()
    {
        return response()->json(Role::select('id', 'name')->get());
    }

    public function topAgents()
    {
        $topAgents = User::whereHas('roles', fn ($query) => $query->where('name', 'agent'))
            ->withCount(['appointments' => fn ($query) => $query->where('status', 'completed')])
            ->orderBy('appointments_count', 'desc')
            ->limit(3)
            ->get(['id', 'name', 'appointments_count']);

        return response()->json($topAgents->map(fn ($agent) => [
            'name' => $agent->name,
            'resolved' => $agent->appointments_count,
            'score' => 0, // CSAT score would need a ratings table
        ]));
    }
}
