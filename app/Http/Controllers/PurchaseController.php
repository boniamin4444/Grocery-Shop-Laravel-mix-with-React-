<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseController extends Controller
{
    /**
     * Fetch products and suppliers for the form.
     */
    public function create()
    {
        try {
            $products = Product::select('id', 'product_name', 'category_id', 'buying_price')
                ->with('category:id,name') // Assuming 'category' relation exists
                ->get();

            $suppliers = Supplier::select('id', 'name')->get();

            return response()->json([
                'products' => $products,
                'suppliers' => $suppliers,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching products and suppliers: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch products and suppliers!',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch all purchases along with product and supplier details.
     */
    public function index()
    {
        try {
            // Fetch all purchases along with product and supplier details
            $purchases = DB::table('purchases')
                ->join('products', 'purchases.product_id', '=', 'products.id')
                ->join('suppliers', 'purchases.supplier_id', '=', 'suppliers.id')
                ->select(
                    'purchases.id',
                    'products.product_name',
                    'suppliers.name as supplier_name',
                    'purchases.purchase_price',
                    'purchases.purchase_quantity',
                    'purchases.total_amount',
                    'purchases.payment_bill_amount',
                    'purchases.due_bill_amount',
                    'purchases.purchase_date'
                )
                ->get();

            return response()->json(['purchases' => $purchases]);
        } catch (\Exception $e) {
            Log::error('Error fetching purchases: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch purchases!',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new purchase.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0.01',
            'purchase_date' => 'required|date',
            'payment_bill_amount' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Calculate total and due amounts
            $totalAmount = $validated['purchase_quantity'] * $validated['purchase_price'];
            $paymentAmount = $validated['payment_bill_amount'] ?? 0;
            $dueAmount = $totalAmount - $paymentAmount;

            // Store purchase
            $purchase = Purchase::create([
                'product_id' => $validated['product_id'],
                'supplier_id' => $validated['supplier_id'],
                'purchase_quantity' => $validated['purchase_quantity'],
                'purchase_price' => $validated['purchase_price'],
                'total_amount' => $totalAmount,
                'payment_bill_amount' => $paymentAmount,
                'due_bill_amount' => $dueAmount,
                'purchase_date' => $validated['purchase_date'],
            ]);

            // Update product stock
            $product = Product::find($validated['product_id']);
            $product->stock_amount += $validated['purchase_quantity'];
            $product->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase created successfully!',
                'purchase' => $purchase,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing purchase: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch product details by ID.
     */
    public function getProductDetails($productId)
    {
        try {
            $product = Product::with('category:id,name')->find($productId);

            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            return response()->json([
                'category' => $product->category ? $product->category->name : 'N/A',
                'buying_price' => $product->buying_price,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching product details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch product details'], 500);
        }
    }
}
