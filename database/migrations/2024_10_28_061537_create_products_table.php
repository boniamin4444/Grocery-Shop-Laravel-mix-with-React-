<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('product_name');
            $table->string('product_code')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // To store image path
            $table->decimal('price', 10, 2);
            $table->decimal('buying_price', 10, 2); // Add buying price
            $table->integer('stock_amount');
            $table->enum('status', ['active', 'inactive', 'discontinued'])->default('active'); // Updated enum for status
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
