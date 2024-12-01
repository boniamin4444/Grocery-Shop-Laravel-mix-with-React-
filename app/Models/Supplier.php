<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    // Define the table name if it's not plural of the model name
    // protected $table = 'suppliers'; // Optional, if you want to specify the table name explicitly

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'note',
    ];

    // Define the 'HasMany' relationship with the Purchase model
    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'supplier_id', 'supplier_id');
    }
    
}
