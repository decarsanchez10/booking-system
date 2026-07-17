<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    public function userIndex(Request $request)
    {
        return response()->json(
            Ticket::with('agent:id,name,email')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->paginate(20)
        );
    }

    public function agentIndex(Request $request)
    {
        return response()->json(
            Ticket::with('user:id,name,email')
                ->where('agent_id', $request->user()->id)
                ->latest()
                ->paginate(20)
        );
    }

    public function adminIndex()
    {
        return response()->json(Ticket::with(['user:id,name,email', 'agent:id,name,email'])->latest()->paginate(50));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string|max:100',
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $data['user_id'] = $request->user()->id;
            $data['status'] = 'Open';

            return response()->json(Ticket::create($data)->load('agent:id,name,email'), 201);
        });
    }

    public function show(Request $request, Ticket $ticket)
    {
        abort_unless($this->canView($request->user(), $ticket), 403);

        return response()->json($ticket->load(['messages.user:id,name,email', 'agent:id,name,email']));
    }

    public function close(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);
        $ticket->update(['status' => 'Closed']);

        return response()->json($ticket);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->agent_id === $request->user()->id, 403);

        $data = $request->validate([
            'status' => ['required', Rule::in(['Open', 'Pending', 'In Progress', 'Resolved', 'Closed'])],
        ]);

        $ticket->update($data);

        return response()->json($ticket);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->agent_id === $request->user()->id, 403);

        $data = $request->validate([
            'message' => 'required|string|max:5000',
            'is_internal' => 'nullable|boolean',
        ]);

        $message = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $data['message'],
            'is_internal' => $data['is_internal'] ?? false,
        ]);

        return response()->json($message->load('user:id,name,email'), 201);
    }

    public function assign(Request $request, Ticket $ticket)
    {
        $data = $request->validate(['agent_id' => 'required|exists:users,id']);
        $agent = User::findOrFail($data['agent_id']);
        abort_unless($agent->hasRole('agent'), 422, 'Selected user is not an agent.');

        $ticket->update(['agent_id' => $agent->id, 'status' => 'In Progress']);

        return response()->json($ticket->load('agent:id,name,email'));
    }

    private function canView(User $user, Ticket $ticket): bool
    {
        return $user->hasRole('admin')
            || $ticket->user_id === $user->id
            || $ticket->agent_id === $user->id;
    }
}
