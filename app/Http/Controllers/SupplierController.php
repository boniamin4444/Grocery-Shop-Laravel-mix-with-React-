<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    // Fetch all suppliers
    public function index()
    {
        $suppliers = Supplier::all();
        return response()->json($suppliers);
    }

    // Store a new supplier
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email|max:255|unique:suppliers,email', // Ensure email is unique
            'note' => 'nullable|string|max:1000', // note validation
        ]);

        // Check if email already exists
        if (Supplier::where('email', $request->email)->exists()) {
            return response()->json(['error' => 'The email address is already registered.'], 400);
        }

        // Create the new supplier
        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    // Get a specific supplier by ID
    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);
        return response()->json($supplier);
    }

    // Update an existing supplier
    public function update(Request $request, $id)
    {
        // Find the supplier by ID
        $supplier = Supplier::findOrFail($id);

        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email|max:255|unique:suppliers,email,' . $supplier->id, // Exclude the current supplier from the unique validation
            'note' => 'nullable|string|max:1000', // note validation
        ]);

        // Update the supplier data
        $supplier->update($validated);

        return response()->json($supplier);
    }

    // Delete a supplier
    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
