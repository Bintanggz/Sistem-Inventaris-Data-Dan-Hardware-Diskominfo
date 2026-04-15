<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'selesai', 'dibatalkan'])->default('pending');
            $table->decimal('cost', 15, 2)->nullable();
            $table->text('description')->nullable();
            $table->string('technician')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
