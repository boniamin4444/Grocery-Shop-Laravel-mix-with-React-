<?php

// database/migrations/xxxx_xx_xx_create_orders_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');  // No change, customer_name remains a regular string field
            $table->string('customer_phone')->nullable();
            $table->string('customer_address');
            $table->integer('customer_number'); // Make customer_number unique
            $table->decimal('total_buying_price', 10, 2); // Total buying price for the order
            $table->decimal('total_price', 10, 2); // Total price for the order
            $table->integer('total_quantity'); // Total quantity of items in the order
            $table->decimal('paid_amount', 10, 2)->default(0); // Default value for paid_amount is 0
            $table->decimal('due_amount', 10, 2)->default(0); // Default value for due_amount is 0
            $table->decimal('extra_amount', 10, 2)->default(0); // Added extra_amount column
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
