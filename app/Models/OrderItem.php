<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'category_id',
        'product_name',
        'product_code',
        'quantity',
        'price',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
{
    return $this->belongsTo(Product::class);
}

    public function orderItems()
    {
    return $this->hasMany(OrderItem::class);
    }
    

    public function category()
{
    return $this->belongsTo(Category::class);
}

}
