<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfitOverviewController extends Controller
{
    public function getProfitOverview(Request $request)
    {
        // Set default date range to today
        $dateRange = $request->get('range', 'today');
        $startDate = Carbon::now();

        switch ($dateRange) {
            case 'last_3_days':
                $startDate = Carbon::now()->subDays(3);
                break;
            case 'last_7_days':
                $startDate = Carbon::now()->subDays(7);
                break;
            case 'last_1_month':
                $startDate = Carbon::now()->subMonth();
                break;
            case 'last_3_months':
                $startDate = Carbon::now()->subMonths(3);
                break;
            case 'last_6_months':
                $startDate = Carbon::now()->subMonths(6);
                break;
            case 'last_1_year':
                $startDate = Carbon::now()->subYear();
                break;
            case 'today':
            default:
                $startDate = Carbon::today();
                break;
        }

        // Fetch orders within the calculated date range
        $orders = Order::where('created_at', '>=', $startDate)
            ->select('id', 'total_price', 'total_buying_price', 'created_at')
            ->with('items')
            ->get();

        // Calculate profit for each order
        $ordersWithProfit = $orders->map(function ($order) {
            $totalPrice = (float) $order->total_price;
            $totalBuyingPrice = (float) $order->total_buying_price;
            $order->profit = $totalPrice - $totalBuyingPrice;
            return $order;
        });

        return response()->json($ordersWithProfit);
    }




    //profit by product

    public function getProfitOverviewByHourly(Request $request)
{
    // Default values for filter
    $filterBy = $request->get('filterBy', '');  // Default to no filter
    $startDate = null;
    $endDate = null;
    
    // Apply hourly filter (using the 'filterBy' value)
    if ($filterBy === 'hour') {
        $hoursAgo = $request->get('hoursAgo', 1);  // Default to 1 hour
        // Log the hoursAgo value for debugging
        \Log::info("Fetching data for hourly filter with hoursAgo: " . $hoursAgo);
        $startDate = Carbon::now()->subHours($hoursAgo);
        $endDate = Carbon::now();  // Always end with current time when filtering by hour
    }
    
    // Apply date range filter
    if ($filterBy === 'date_range') {
        $startDateInput = $request->get('startDate');
        $endDateInput = $request->get('endDate');
        
        // If start date is provided, parse it, otherwise return all data (no filter)
        if ($startDateInput) {
            $startDate = Carbon::parse($startDateInput)->startOfDay();
        }
        
        // If end date is provided, parse it, otherwise return all data (no filter)
        if ($endDateInput) {
            $endDate = Carbon::parse($endDateInput)->endOfDay();
        }
    }
    
    // Check if both start and end dates are still null, meaning no filter is applied
    if (!$startDate || !$endDate) {
        // If no filters are provided, fetch all orders (no date range)
        $orders = Order::select('id', 'customer_name', 'customer_phone', 'total_price', 
                               'total_buying_price', 'total_quantity', 'paid_amount', 
                               'due_amount', 'extra_amount', 'created_at')->get();
        // Log the query data for debugging
        \Log::info("Fetching all orders without a date range filter.");
    } else {
        // Fetch orders within the specified date range
        $orders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->select('id', 'customer_name', 'customer_phone', 'total_price', 'total_buying_price', 
                     'total_quantity', 'paid_amount', 'due_amount', 'extra_amount', 'created_at')
            ->get();
        // Log the date range for debugging
        \Log::info("Fetching orders from {$startDate} to {$endDate}");
    }
    
    // Log the query data for debugging
    \Log::info("Fetched orders: " . $orders->count());
    
    // Calculate total sales and total profit
    $totalSales = $orders->sum('total_price');
    $totalBuyingPrice = $orders->sum('total_buying_price');
    $totalProfit = $totalSales - $totalBuyingPrice;
    
    // Calculate profit for each order
    $ordersWithProfit = $orders->map(function ($order) {
        $order->profit = $order->total_price - $order->total_buying_price;
        return $order;
    });
    
    return response()->json([
        'total_sales' => $totalSales,
        'total_buying_price' => $totalBuyingPrice,
        'total_profit' => $totalProfit,
        'orders' => $ordersWithProfit, // Return the detailed order data
    ]);
}

  


}
