<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class OrderReportController extends Controller
{
    // Fetch all Orders
    public function index()
    {
        // Fetch all orders, including their items and category names, sorted by ID in descending order
        $orders = Order::with('items.category')
            ->orderBy('id', 'desc') // Sort by ID in descending order
            ->get();
        return response()->json($orders);
    }

    // Fetch details of a specific order
    public function show($id)
    {
        try {
            // Fetch order along with its related order items and category
            $order = Order::with('items.category')->findOrFail($id); // Eager load category with order items
            return response()->json($order); // Return the order data along with the items
        } catch (\Exception $e) {
            // Return a 404 response if the order is not found
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    // Fetch due and add due 

    
    // Fetch customer details based on phone number
    public function getCustomerDetails(Request $request)
    {
        $validatedData = $request->validate([
            'customer_phone' => 'required|string|max:15',
        ]);

        // Fetch customer details based on phone number
        $customer = Order::where('customer_phone', $validatedData['customer_phone'])
            ->select('customer_name', 'customer_address', 'customer_phone', 'customer_number')
            ->selectRaw('SUM(paid_amount) as total_paid_amount')
            ->selectRaw('SUM(due_amount) as total_due_amount')
            ->groupBy('customer_name', 'customer_address', 'customer_phone', 'customer_number')
            ->first();

        if (!$customer) {
            return response()->json(['message' => 'Customer not found.'], 404);
        }

        return response()->json($customer);
    }

    // Pay due amount for a customer
    public function payDueAmount(Request $request)
    {
        $validatedData = $request->validate([
            'customer_number' => 'required|integer',
            'amount' => 'required|numeric|min:0',
        ]);
    
        try {
            // Find all orders for the customer, ordered by creation date
            $orders = Order::where('customer_number', $validatedData['customer_number'])
                ->orderBy('created_at', 'asc') // Order by the earliest order first
                ->get();
    
            if ($orders->isEmpty()) {
                return response()->json(['message' => 'No orders found for this customer.'], 404);
            }
    
            $remainingAmount = $validatedData['amount']; // Start with the total payment amount
            $updatedOrders = [];
    
            foreach ($orders as $order) {
                if ($remainingAmount <= 0) {
                    break; // Stop if there's no more payment to distribute
                }
    
                // Calculate how much to pay on this order
                $orderDueAmount = $order->due_amount;
                $paymentToApply = min($remainingAmount, $orderDueAmount); // Pay up to the order's due amount
    
                // Update the paid_amount and due_amount
                $order->paid_amount += $paymentToApply;
                $order->due_amount = $order->total_price - $order->paid_amount;
    
                // Update remaining amount to be distributed
                $remainingAmount -= $paymentToApply;
    
                // Save the updated order
                $order->save();
    
                // Collect updated order for the response
                $updatedOrders[] = $order;
            }
    
            // If there is still remaining amount, it means we have overpaid
            if ($remainingAmount > 0) {
                return response()->json(['message' => 'The payment exceeds the due amount.'], 400);
            }
    
            return response()->json(['message' => 'Payment successful', 'updated_orders' => $updatedOrders]);
    
        } catch (\Exception $e) {
            // Log error if something goes wrong
            Log::error('Error updating payment: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while processing the payment.'], 500);
        }
    }

    //fetch details with due and paid 

    
}
