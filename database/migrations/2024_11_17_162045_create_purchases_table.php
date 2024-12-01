<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchasesTable extends Migration
{
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('supplier_id');
            $table->integer('purchase_quantity');
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('payment_bill_amount', 10, 2)->nullable();
            $table->decimal('due_bill_amount', 10, 2)->nullable();
            $table->date('purchase_date');
            $table->timestamps();
        });                        
        
    }

    public function down()
    {
        Schema::dropIfExists('purchases');
    }
}

