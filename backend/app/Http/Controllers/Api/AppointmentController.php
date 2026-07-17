<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function userIndex(Request $request)
    {
        return response()->json(
            Appointment::with('agent:id,name,email,specialties')
                ->where('user_id', $request->user()->id)
                ->latest('appointment_date')
                ->paginate(20)
        );
    }

    public function agentIndex(Request $request)
    {
        return response()->json(
            Appointment::with('user:id,name,email,avatar')
                ->where('agent_id', $request->user()->id)
                ->latest('appointment_date')
                ->paginate(20)
        );
    }

    public function adminIndex()
    {
        return response()->json(
            Appointment::with(['user:id,name,email', 'agent:id,name,email'])
                ->latest('appointment_date')
                ->paginate(50)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agent_id' => 'required|exists:users,id',
            'category' => 'required|string|max:100',
            'appointment_date' => 'required|date|after:now',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
            'description' => 'required|string|max:5000',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $data['user_id'] = $request->user()->id;
            $data['status'] = 'Pending';
            $this->abortOnConflict($data['agent_id'], $data['appointment_date']);

            $appointment = Appointment::create($data);

            // Auto-create welcome message to start chat conversation
            ChatMessage::create([
                'appointment_id' => $appointment->id,
                'sender_id' => $request->user()->id,
                'message' => "Hi! I've booked an appointment for {$data['category']}. Looking forward to our session!",
                'is_read' => false,
            ]);

            return response()->json($appointment->load('agent:id,name,email,specialties'), 201);
        });
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        abort_unless($appointment->user_id === $request->user()->id, 403);
        abort_if(in_array($appointment->status, ['Cancelled', 'Completed'], true), 422, 'Appointment cannot be cancelled.');

        $appointment->update(['status' => 'Cancelled']);

        return response()->json($appointment);
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        abort_unless($appointment->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'appointment_date' => 'required|date|after:now',
        ]);

        $this->abortOnConflict($appointment->agent_id, $data['appointment_date'], $appointment->id);
        $appointment->update(['appointment_date' => $data['appointment_date'], 'status' => 'Pending']);

        return response()->json($appointment->fresh());
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled'])],
        ]);

        if ($request->user()->hasRole('agent')) {
            abort_unless($appointment->agent_id === $request->user()->id, 403);
        }

        $appointment->update($data);

        return response()->json($appointment);
    }

    public function assign(Request $request, Appointment $appointment)
    {
        $data = $request->validate(['agent_id' => 'required|exists:users,id']);
        $agent = User::findOrFail($data['agent_id']);
        abort_unless($agent->hasRole('agent'), 422, 'Selected user is not an agent.');

        $this->abortOnConflict($agent->id, $appointment->appointment_date, $appointment->id);
        $appointment->update(['agent_id' => $agent->id, 'status' => 'Approved']);

        return response()->json($appointment->load('agent:id,name,email'));
    }

    private function abortOnConflict(?int $agentId, string $appointmentDate, ?int $ignoreId = null): void
    {
        if (!$agentId) {
            return;
        }

        $query = Appointment::where('agent_id', $agentId)
            ->where('appointment_date', $appointmentDate)
            ->whereNotIn('status', ['Cancelled', 'Rejected']);

        if ($ignoreId) {
            $query->whereKeyNot($ignoreId);
        }

        abort_if($query->exists(), 409, 'The selected agent already has an appointment at that time.');
    }
}
