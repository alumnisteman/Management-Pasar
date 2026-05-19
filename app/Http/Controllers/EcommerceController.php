<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EcommerceController extends Controller
{
    public function getProducts(Request $request)
    {
        $query = Product::where('is_active', true)->with('trader');
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        return response()->json($query->paginate(20));
    }

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'trader_id' => 'required|exists:traders,id',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'id' => (string) Str::uuid(),
            'customer_id' => $validated['customer_id'],
            'trader_id' => $validated['trader_id'],
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
            'total_amount' => 0,
            'status' => 'pending'
        ]);

        $total = 0;
        foreach ($validated['items'] as $itemData) {
            $product = Product::find($itemData['product_id']);
            $price = $product->price;
            $quantity = $itemData['quantity'];
            
            OrderItem::create([
                'id' => (string) Str::uuid(),
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $price,
            ]);
            $total += ($price * $quantity);
            
            // Deduct stock
            $product->decrement('stock', $quantity);
        }

        $order->update(['total_amount' => $total]);

        return response()->json($order->load('items'), 201);
    }
}
