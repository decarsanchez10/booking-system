<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            DB::table('sys_notifications')
                ->where('notifiable_type', $request->user()::class)
                ->where('notifiable_id', $request->user()->id)
                ->latest()
                ->paginate(20)
        );
    }

    public function markRead(Request $request, string $id)
    {
        DB::table('sys_notifications')
            ->where('id', $id)
            ->where('notifiable_type', $request->user()::class)
            ->where('notifiable_id', $request->user()->id)
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllRead(Request $request)
    {
        DB::table('sys_notifications')
            ->where('notifiable_type', $request->user()::class)
            ->where('notifiable_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read.']);
    }
}
