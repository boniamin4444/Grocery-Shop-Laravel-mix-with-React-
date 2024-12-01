<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderReportController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierPurchaseController;
use App\Http\Controllers\ProfitOverviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//CAtegory Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

//Product Route

// Get all products
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::post('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
//only stock update route
Route::post('/products/{id}/add-stock', [ProductController::class, 'addStock']);


// Order Routes

Route::post('/orders', [OrderController::class, 'store']); // Store order
Route::get('/categories', [CategoryController::class, 'index']); // Get all categories
Route::get('/products/{category_id}', [OrderController::class, 'getProductsByCategory']); // Get products by category
Route::get('/orders/customers', [OrderController::class, 'getOldCustomers']);
Route::get('/orders/customers/{customerNumber}', [OrderController::class, 'getDueAmount']);

//ORder REport

Route::get('/ordersreport', [OrderReportController::class, 'index']);
Route::get('/ordersreport/{id}', [OrderReportController::class, 'show']);

// fetch due and update due amount 
Route::get('/customers-with-due', [OrderReportController::class, 'getCustomersWithDueAmount']);

// Search for customer by phone number
Route::get('/customer-details', [OrderReportController::class, 'getCustomerDetails']);

// Pay due amount for a customer
Route::post('/pay-due', [OrderReportController::class, 'payDueAmount']);
//fetch details with due amount and paid amount 


//inventory route
Route::get('/inventory', [InventoryController::class, 'getInventory']);
Route::get('/inventory-overview', [InventoryController::class, 'getOverview']);


// All Routes Of Suppliers 

Route::prefix('suppliers')->group(function () {
    Route::get('/', [SupplierController::class, 'index']);
    Route::post('/', [SupplierController::class, 'store']);
    Route::get('{id}', [SupplierController::class, 'show']);
    Route::put('{id}', [SupplierController::class, 'update']);
    Route::delete('{id}', [SupplierController::class, 'destroy']);
});

Route::get('/supplierspurchase', [SupplierPurchaseController::class, 'getSuppliers']);
Route::get('/supplierspurchase/{supplierId}/purchases', [SupplierPurchaseController::class, 'getSupplierPurchases']);
Route::get('/supplierspurchase/{supplierId}/summary', [SupplierPurchaseController::class, 'getSupplierSummary']);
Route::put('supplierspurchase/{supplierId}/adjust_due', [SupplierPurchaseController::class, 'adjustDueAmount']);


//purchase route

Route::get('/purchases/create', [PurchaseController::class, 'create']);

    // Store new purchase
Route::post('/purchases', [PurchaseController::class, 'store']);
// Fetch product details by ID
Route::get('/purchases/product/{productId}', [PurchaseController::class, 'getProductDetails']);
// Fetch supplier's previous due
Route::get('/purchases/supplier-due/{supplierId}', [PurchaseController::class, 'getSupplierDue']);
Route::get('/purchasesList', [PurchaseController::class, 'index']);


// Profit Over view route
Route::get('/profit-overview', [ProfitOverviewController::class, 'getProfitOverview']);
Route::get('/profit-overview-by-hourly', [ProfitOverviewController::class, 'getProfitOverviewByHourly']);






Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
