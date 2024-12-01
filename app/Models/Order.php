<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Define the fillable attributes to allow mass assignment
    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_address',
        'customer_number',
        'total_buying_price',
        'total_price',
        'total_quantity',
        'paid_amount',
        'due_amount',
        'extra_amount',  // Added extra_amount to the fillable array
    ];

    // Relationship: An order can have many items (OrderItem)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderItems()
{
    return $this->hasMany(OrderItem::class);
}
}
