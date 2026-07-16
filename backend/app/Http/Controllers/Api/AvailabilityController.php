<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgentAvailability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            AgentAvailability::where('agent_id', $request->user()->id)
                ->orderBy('starts_at')
                ->paginate(50)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'starts_at' => 'required|date|after:now',
            'ends_at' => 'required|date|after:starts_at',
            'is_available' => 'nullable|boolean',
        ]);

        $data['agent_id'] = $request->user()->id;

        return response()->json(AgentAvailability::create($data), 201);
    }

    public function destroy(Request $request, AgentAvailability $slot)
    {
        abort_unless($slot->agent_id === $request->user()->id, 403);
        $slot->delete();

        return response()->json(['message' => 'Availability removed.']);
    }

    public function agentSlots(int $agent)
    {
        return response()->json(
            AgentAvailability::where('agent_id', $agent)
                ->where('is_available', true)
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at')
                ->limit(100)
                ->get()
        );
    }
}
