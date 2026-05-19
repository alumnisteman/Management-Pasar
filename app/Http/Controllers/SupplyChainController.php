<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupplyChainController extends Controller
{
    public function getVendorProducts()
    {
        // Mock method: normally this would fetch products from a VendorProduct table
        return response()->json(['message' => 'List of vendor products']);
    }

    public function createPurchaseOrder(Request $request)
    {
        $validated = $request->validate([
            'trader_id' => 'required|exists:traders,id',
            'vendor_id' => 'required|exists:vendors,id',
            'expected_delivery_date' => 'nullable|date',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $po = PurchaseOrder::create([
            'id' => (string) Str::uuid(),
            'trader_id' => $validated['trader_id'],
            'vendor_id' => $validated['vendor_id'],
            'expected_delivery_date' => $validated['expected_delivery_date'] ?? now()->addDays(3),
            'status' => 'pending',
            'total_amount' => 0
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'id' => (string) Str::uuid(),
                'purchase_order_id' => $po->id,
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price']
            ]);
            $total += ($item['quantity'] * $item['unit_price']);
        }

        $po->update(['total_amount' => $total]);

        return response()->json($po->load('items'), 201);
    }
}
