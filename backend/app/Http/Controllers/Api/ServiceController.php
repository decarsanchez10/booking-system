<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::where('is_active', true)->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'estimated_duration' => 'nullable|integer|min:1|max:1440',
            'priority_level' => 'nullable|in:Low,Normal,High,Urgent',
            'is_active' => 'nullable|boolean',
            'image_path' => 'nullable|string|max:255',
        ]);

        return response()->json(Service::create($data), 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'estimated_duration' => 'sometimes|integer|min:1|max:1440',
            'priority_level' => 'sometimes|in:Low,Normal,High,Urgent',
            'is_active' => 'sometimes|boolean',
            'image_path' => 'nullable|string|max:255',
        ]);

        $service->update($data);

        return response()->json($service->fresh());
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }

    public function specialties()
    {
        $specialties = Service::where('is_active', true)
            ->select('id', 'name', 'description', 'category')
            ->orderBy('name')
            ->get();

        return response()->json($specialties);
    }
}
