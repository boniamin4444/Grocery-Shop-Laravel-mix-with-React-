<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'product_name' => 'required|string|max:255',
            'product_code' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric',
            'buying_price' => 'required|numeric',  // Ensure buying price is validated
            'stock_amount' => 'required|integer',
            'status' => 'required|in:active,inactive,discontinued',  // Enforcing enum validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'product_name' => $request->product_name,
            'product_code' => $request->product_code,
            'description' => $request->description,
            'image' => $imagePath,
            'price' => $request->price,
            'buying_price' => $request->buying_price,  // Save buying price
            'stock_amount' => $request->stock_amount,
            'status' => $request->status,
        ]);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product, 200);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'product_name' => 'required|string|max:255',
            'product_code' => 'required|string|max:255|unique:products,product_code,' . $product->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric',
            'buying_price' => 'required|numeric',  // Ensure buying price is validated
            'stock_amount' => 'required|integer',
            'status' => 'required|in:active,inactive,discontinued',  // Enforcing enum validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::delete('public/' . $imagePath);  // Deleting the old image if it exists
            }
            $imagePath = $request->file('image')->store('products', 'public');  // Storing the new image
        }

        $product->update([
            'category_id' => $request->category_id,
            'product_name' => $request->product_name,
            'product_code' => $request->product_code,
            'description' => $request->description,
            'image' => $imagePath,
            'price' => $request->price,
            'buying_price' => $request->buying_price,  // Save buying price
            'stock_amount' => $request->stock_amount,
            'status' => $request->status,
        ]);

        return response()->json($product, 200);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete the image if it exists
        if ($product->image) {
            Storage::delete('public/' . $product->image);
        }

        $product->delete();

        return response()->json(null, 204);  // Successfully deleted
    }

    // stock update function 
    public function addStock(Request $request, $id)
{
    $request->validate([
        'stock' => 'required|integer|min:1',
    ]);

    $product = Product::find($id);

    if ($product) {
        $product->stock_amount += $request->stock;
        $product->save();

        return response()->json(['message' => 'Stock updated successfully'], 200);
    } else {
        return response()->json(['message' => 'Product not found'], 404);
    }
}



}
