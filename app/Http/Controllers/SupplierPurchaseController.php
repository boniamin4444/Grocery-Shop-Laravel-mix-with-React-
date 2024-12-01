<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

class SupplierPurchaseController extends Controller
{
    // Fetch suppliers with total purchases
    public function getSuppliers(Request $request)
    {
        try {
            $query = Supplier::query();
    
            // Fetch suppliers with purchases and total_price sum
            $suppliers = $query->with(['purchases'])
                               ->paginate(10);
    
            // Check if search query is provided
            if ($request->has('search') && $request->input('search') !== null) {
                $search = $request->input('search');
                $suppliers = $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%")
                          ->orWhere('email', 'like', "%$search%");
                })
                ->with(['purchases'])
                ->paginate(10);
            }
    
            return response()->json($suppliers);
        } catch (\Exception $e) {
            // Log the error
            \Log::error($e->getMessage());
    
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }    

    // Fetch all purchases for a specific supplier
    public function getSupplierPurchases($supplierId)
    {
        try {
            // Fetch purchases for the supplier with product and supplier data
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
                ->where('purchases.supplier_id', $supplierId)
                ->get();

            return response()->json($purchases, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching supplier purchases: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch purchases!'], 500);
        }
    }

    // Calculate summary for a supplier
    public function getSupplierSummary($supplierId)
{
    try {
        // Fetch the summary and supplier data for the given supplier_id
        $summary = DB::table('purchases')
            ->join('products', 'purchases.product_id', '=', 'products.id')
            ->join('suppliers', 'purchases.supplier_id', '=', 'suppliers.id')
            ->select(
                'suppliers.name as supplier_name',
                'suppliers.email as supplier_email',
                'suppliers.phone as supplier_contact',
                'suppliers.address as supplier_address',
                DB::raw('COUNT(purchases.id) as total_products'),
                DB::raw('SUM(purchases.purchase_quantity) as total_quantity'),
                DB::raw('SUM(purchases.total_amount) as total_price'),
                DB::raw('SUM(purchases.purchase_price) as total_buying_price'),
                DB::raw('SUM(purchases.total_amount - purchases.payment_bill_amount) as total_due'),
                DB::raw('SUM(purchases.payment_bill_amount) as total_paid')
            )
            ->where('purchases.supplier_id', $supplierId)
            ->groupBy(
                'suppliers.id', 
                'suppliers.name', 
                'suppliers.email',
                'suppliers.phone',
                'suppliers.address'
            )
            ->first();

        return response()->json($summary, 200);
    } catch (\Exception $e) {
        \Log::error('Error fetching supplier summary: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch supplier summary!'], 500);
    }
}

// In SupplierController.php

public function adjustDueAmount(Request $request, $supplierId)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        'amount' => 'required|numeric|min:0',
    ]);

    try {
        // Fetch the supplier
        $supplier = Supplier::findOrFail($supplierId);

        // Calculate the total due amount for the supplier
        $totalDue = $supplier->purchases->sum('due_bill_amount');
        $adjustAmount = $validatedData['amount'];

        // Check if the adjustment amount is greater than the total due amount
        if ($adjustAmount > $totalDue) {
            return response()->json(['error' => 'Adjustment amount exceeds total due!'], 400);
        }

        $updatedPurchases = []; // To store updated purchases for the response

        foreach ($supplier->purchases as $purchase) {
            if ($adjustAmount <= 0) {
                break; // Stop if there's no more adjustment to apply
            }

            $dueAmount = $purchase->due_bill_amount;

            if ($dueAmount > 0) {
                // Calculate the amount to apply to this purchase
                if ($adjustAmount >= $dueAmount) {
                    $purchase->payment_bill_amount += $dueAmount; // Fully pay off this purchase
                    $purchase->due_bill_amount = 0; // No remaining due
                    $adjustAmount -= $dueAmount; // Decrease the adjustment amount
                } else {
                    $purchase->payment_bill_amount += $adjustAmount; // Partial payment
                    $purchase->due_bill_amount -= $adjustAmount; // Decrease the due amount
                    $adjustAmount = 0; // All adjustment applied
                }

                // Save the updated purchase
                $purchase->save();

                // Collect updated purchase for the response
                $updatedPurchases[] = $purchase;
            }
        }

        // If there is still remaining adjustment amount, it means we have overpaid
        if ($adjustAmount > 0) {
            return response()->json(['error' => 'The adjustment amount exceeds the due amounts.'], 400);
        }

        return response()->json(['message' => 'Due amount adjusted successfully!', 'updated_purchases' => $updatedPurchases], 200);
        
    } catch (\Exception $e) {
        \Log::error('Error adjusting due amount: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to adjust due amount!'], 500);
    }
}

}
