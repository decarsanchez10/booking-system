<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\KnowledgeBaseController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AvailabilityController;

// ────────────────────────────────────────────────
// PUBLIC ROUTES
// ────────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password',  [AuthController::class, 'resetPassword']);

// Public service listing
Route::get('/services', [ServiceController::class, 'index']);

// Public KB
Route::get('/kb/categories', [KnowledgeBaseController::class, 'categories']);
Route::get('/kb/articles',   [KnowledgeBaseController::class, 'articles']);
Route::get('/kb/articles/{article}', [KnowledgeBaseController::class, 'show']);

// ────────────────────────────────────────────────
// AUTHENTICATED ROUTES (any role)
// ────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::post('/auth/logout',  [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me',       [AuthController::class, 'me']);

    // Notifications
    Route::get('/notifications',            [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',  [NotificationController::class, 'markAllRead']);

    // ── USER ROUTES ──
    Route::middleware('role:user')->prefix('user')->group(function () {
        Route::get('/dashboard',        [UserController::class, 'dashboard']);
        Route::get('/appointments',     [AppointmentController::class, 'userIndex']);
        Route::post('/appointments',    [AppointmentController::class, 'store']);
        Route::put('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        Route::put('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);

        Route::get('/tickets',          [TicketController::class, 'userIndex']);
        Route::post('/tickets',         [TicketController::class, 'store']);
        Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
        Route::put('/tickets/{ticket}/close', [TicketController::class, 'close']);

        Route::get('/agents',           [AgentController::class, 'publicList']);
        Route::get('/agents/{agent}/availability', [AvailabilityController::class, 'agentSlots']);

        Route::get('/profile',          [UserController::class, 'profile']);
        Route::put('/profile',          [UserController::class, 'updateProfile']);
        Route::post('/profile/avatar',  [UserController::class, 'uploadAvatar']);
        Route::put('/profile/password', [UserController::class, 'changePassword']);
    });

    // ── AGENT ROUTES ──
    Route::middleware('role:agent')->prefix('agent')->group(function () {
        Route::get('/dashboard',        [AgentController::class, 'dashboard']);
        Route::get('/appointments',     [AppointmentController::class, 'agentIndex']);
        Route::put('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);

        Route::get('/tickets',          [TicketController::class, 'agentIndex']);
        Route::put('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);
        Route::post('/tickets/{ticket}/reply', [TicketController::class, 'reply']);

        Route::get('/availability',     [AvailabilityController::class, 'index']);
        Route::post('/availability',    [AvailabilityController::class, 'store']);
        Route::delete('/availability/{slot}', [AvailabilityController::class, 'destroy']);

        Route::get('/profile',          [AgentController::class, 'profile']);
        Route::put('/profile',          [AgentController::class, 'updateProfile']);
    });

    // ── ADMIN ROUTES ──
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard',        [AdminController::class, 'dashboard']);

        // Users Management
        Route::get('/users',            [AdminController::class, 'users']);
        Route::post('/users',           [AdminController::class, 'createUser']);
        Route::put('/users/{user}',     [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}',  [AdminController::class, 'deleteUser']);
        Route::put('/users/{user}/role', [AdminController::class, 'changeRole']);

        // Services Management
        Route::post('/services',         [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

        // Appointments Management
        Route::get('/appointments',     [AppointmentController::class, 'adminIndex']);
        Route::put('/appointments/{appointment}/assign', [AppointmentController::class, 'assign']);

        // Tickets Management
        Route::get('/tickets',          [TicketController::class, 'adminIndex']);
        Route::put('/tickets/{ticket}/assign', [TicketController::class, 'assign']);

        // KB Management
        Route::post('/kb/articles',         [KnowledgeBaseController::class, 'store']);
        Route::put('/kb/articles/{article}', [KnowledgeBaseController::class, 'update']);
        Route::delete('/kb/articles/{article}', [KnowledgeBaseController::class, 'destroy']);

        // Reports
        Route::get('/reports/overview',     [AdminController::class, 'reportsOverview']);
        Route::get('/settings',             [AdminController::class, 'getSettings']);
        Route::put('/settings',             [AdminController::class, 'updateSettings']);
    });
});
