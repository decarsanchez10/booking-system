<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Get messages for an appointment.
     * Both the user who owns the appointment and the assigned agent can access.
     */
    public function index(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        // Authorization: must be the user or the agent on this appointment
        if ($appointment->user_id !== $user->id && $appointment->agent_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Mark messages from the other party as read
        ChatMessage::where('appointment_id', $appointment->id)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = ChatMessage::with('sender')
            ->where('appointment_id', $appointment->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message.
     */
    public function store(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if ($appointment->user_id !== $user->id && $appointment->agent_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $msg = ChatMessage::create([
            'appointment_id' => $appointment->id,
            'sender_id'      => $user->id,
            'message'        => $data['message'],
            'is_read'        => false,
        ]);

        return response()->json($msg->load('sender'), 201);
    }

    /**
     * Get unread count for the authenticated user across all their appointments.
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        // Get appointment IDs this user is part of
        $appointmentIds = Appointment::where('user_id', $user->id)
            ->orWhere('agent_id', $user->id)
            ->pluck('id');

        $count = ChatMessage::whereIn('appointment_id', $appointmentIds)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread' => $count]);
    }

    /**
     * Get list of chat conversations for the current user.
     */
    public function conversations(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::with(['user:id,name,avatar', 'agent:id,name,avatar'])
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('agent_id', $user->id);
            })
            ->whereIn('status', ['Pending', 'Confirmed', 'In Progress', 'Completed'])
            ->latest('appointment_date')
            ->get()
            ->map(function ($apt) use ($user) {
                $lastMsg = ChatMessage::where('appointment_id', $apt->id)
                    ->latest()
                    ->first();

                $unread = ChatMessage::where('appointment_id', $apt->id)
                    ->where('sender_id', '!=', $user->id)
                    ->where('is_read', false)
                    ->count();

                $otherUser = $user->id === $apt->user_id ? $apt->agent : $apt->user;

                return [
                    'appointment_id' => $apt->id,
                    'category'       => $apt->category,
                    'status'         => $apt->status,
                    'appointment_date' => $apt->appointment_date,
                    'other_user'     => $otherUser ?: ['name' => 'Unknown', 'id' => 0],
                    'last_message'   => $lastMsg ? $lastMsg->message : 'No messages yet',
                    'last_message_at' => $lastMsg ? $lastMsg->created_at : $apt->created_at,
                    'unread'         => $unread,
                ];
            });

        return response()->json($appointments);
    }
}
