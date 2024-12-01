<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    // Fetch paginated product inventory
    public function getInventory()
    {
        try {
            $inventory = Product::with('category')
                ->select('id', 'product_name', 'product_code', 'category_id', 'buying_price', 'price', 'stock_amount')
                ->paginate(10); // Paginate 10 items per page

            // Modify the data structure before returning
            $inventory->getCollection()->transform(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_code' => $item->product_code,
                    'category_name' => $item->category->name ?? 'N/A',
                    'buying_price' => $item->buying_price,
                    'price' => $item->price,
                    'stock_amount' => $item->stock_amount,
                ];
            });

            return response()->json($inventory, 200);
        } catch (\Exception $e) {
            Log::error('Error in getInventory: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching the inventory.'], 500);
        }
    }

    // Get inventory sales overvi

    public function getOverview()
{
    try {
        // Today's Sales Calculation based on total_price
        $todaySales = Order::whereDate('created_at', Carbon::today())->sum('total_price');

        // Total Sales Calculation based on total_price
        $totalSales = Order::sum('total_price');

        // Sales for Last 3 Days based on total_price
        $last3DaysSales = Order::whereDate('created_at', '>=', Carbon::now()->subDays(3))->sum('total_price');

        // Sales for Last 7 Days based on total_price
        $last7DaysSales = Order::whereDate('created_at', '>=', Carbon::now()->subDays(7))->sum('total_price');

        // Sales for Last 15 Days based on total_price
        $last15DaysSales = Order::whereDate('created_at', '>=', Carbon::now()->subDays(15))->sum('total_price');

        // Sales for Last 1 Month based on total_price
        $lastMonthSales = Order::whereDate('created_at', '>=', Carbon::now()->subMonth())->sum('total_price');

        // Sales for Last 3 Months based on total_price
        $last3MonthsSales = Order::whereDate('created_at', '>=', Carbon::now()->subMonths(3))->sum('total_price');

        // Sales for Last 6 Months based on total_price
        $last6MonthsSales = Order::whereDate('created_at', '>=', Carbon::now()->subMonths(6))->sum('total_price');

        // Sales for Last 1 Year based on total_price
        $last1YearSales = Order::whereDate('created_at', '>=', Carbon::now()->subYear())->sum('total_price');

        // Profit Calculation (total_buying_price - total_price)
        $todayProfit = Order::whereDate('created_at', Carbon::today())
            ->get()
            ->sum(function ($order) {
                return ($order->total_buying_price - $order->total_price);
            });

        $calculateProfit = function ($startDate) {
            return Order::whereDate('created_at', '>=', $startDate)
                ->get()
                ->sum(function ($order) {
                    return ($order->total_buying_price - $order->total_price);
                });
        };

        $last3DaysProfit = $calculateProfit(Carbon::now()->subDays(3));
        $last7DaysProfit = $calculateProfit(Carbon::now()->subDays(7));
        $last15DaysProfit = $calculateProfit(Carbon::now()->subDays(15));
        $lastMonthProfit = $calculateProfit(Carbon::now()->subMonth());
        $last3MonthsProfit = $calculateProfit(Carbon::now()->subMonths(3));
        $last6MonthsProfit = $calculateProfit(Carbon::now()->subMonths(6));
        $last1YearProfit = $calculateProfit(Carbon::now()->subYear());

        // Additional Metrics
        $totalCategories = Product::distinct('category_id')->count();
        $totalCustomers = Order::distinct('customer_number')->count();
        $totalDueAmount = Order::sum('due_amount');

        // Total Profit Calculation (total_buying_price - total_price) for all orders
        $totalProfit = Order::get()
            ->sum(function ($order) {
                return $order->total_price - $order->total_buying_price;
            });

        // New Profit Calculations for specific hours
        $calculateProfitByHours = function ($hours) {
            return Order::where('created_at', '>=', Carbon::now()->subHours($hours))
                ->get()
                ->sum(function ($order) {
                    return ($order->total_buying_price - $order->total_price);
                });
        };

        $last3HoursProfit = $calculateProfitByHours(3);
        $last5HoursProfit = $calculateProfitByHours(5);
        $last8HoursProfit = $calculateProfitByHours(8);

        // Prepare Overview Response
        $overview = [
            'total_products' => Product::count(),
            'total_sales' => $totalSales,
            'today_sales' => $todaySales,
            'last_3_days_sales' => $last3DaysSales,
            'last_7_days_sales' => $last7DaysSales,
            'last_15_days_sales' => $last15DaysSales,
            'last_month_sales' => $lastMonthSales,
            'last_3_months_sales' => $last3MonthsSales,
            'last_6_months_sales' => $last6MonthsSales,
            'last_1_year_sales' => $last1YearSales,
            'today_profit' => $todayProfit,
            'last_3_days_profit' => $last3DaysProfit,
            'last_7_days_profit' => $last7DaysProfit,
            'last_15_days_profit' => $last15DaysProfit,
            'last_month_profit' => $lastMonthProfit,
            'last_3_months_profit' => $last3MonthsProfit,
            'last_6_months_profit' => $last6MonthsProfit,
            'last_1_year_profit' => $last1YearProfit,
            'total_profit' => $totalProfit, // Add the total profit here
            'total_categories' => $totalCategories,
            'total_customers' => $totalCustomers,
            'total_due_amount' => $totalDueAmount,
            'last_3_hours_profit' => $last3HoursProfit,  // New Profit for Last 3 Hours
            'last_5_hours_profit' => $last5HoursProfit,  // New Profit for Last 5 Hours
            'last_8_hours_profit' => $last8HoursProfit,  // New Profit for Last 8 Hours
        ];

        return response()->json($overview, 200);
    } catch (\Exception $e) {
        // Log the error
        Log::error('Error in getOverview: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while fetching the data.'], 500);
    }
}

}
