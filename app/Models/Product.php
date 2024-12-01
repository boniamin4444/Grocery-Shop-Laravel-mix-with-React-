<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'product_name',
        'product_code',
        'description',
        'image',
        'price',
        'buying_price',
        'stock_amount',
        'status',  // No need to cast enum, just treat it as string
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'buying_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Check if product is available
    public function isAvailable()
    {
        return $this->status === 'active' && $this->stock_amount > 0;
    }

    // Get formatted price
    public function formattedPrice()
    {
        return number_format($this->price, 2);
    }

    // Get formatted buying price
    public function formattedBuyingPrice()
    {
        return number_format($this->buying_price, 2);
    }

    // Adjust stock amount
    public function adjustStock($quantity)
    {
        $this->stock_amount -= $quantity;
        $this->save();
    }

    // Scope to get only active products
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Generate image URL
    public function imageUrl()
    {
        return asset('storage/' . $this->image);
    }

    public function orderItems()
{
    return $this->hasMany(OrderItem::class);
}

}
