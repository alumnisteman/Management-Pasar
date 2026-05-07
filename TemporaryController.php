<?php

namespace App\Http\Controllers;

use App\Models\TemporaryStall;
use App\Models\TemporaryPermit;
use App\Services\TemporaryBookingService;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;

class TemporaryController extends Controller
{
    protected $bookingService;

    public function __construct(TemporaryBookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function stalls()
    {
        return TemporaryStall::all();
    }

    public function book(Request $request)
    {
        $request->validate([
            'stall_id' => 'required|exists:temporary_stalls,id',
            'date' => 'required|date|after_or_equal:today',
            'shift' => 'required|in:pagi,siang,malam'
        ]);

        try {
            // In a real app, use auth()->id(). For now, we'll try to get it from request if for testing.
            $vendorId = Auth::id() ?? $request->vendor_id;
            
            if (!$vendorId) {
                return response()->json(['error' => 'Unauthenticated.'], 401);
            }

            $permit = $this->bookingService->book(
                $vendorId,
                $request->stall_id,
                $request->date,
                $request->shift
            );

            AuditLogger::log('BOOK_TEMPORARY_STALL', [
                'vendor_id' => $vendorId,
                'stall_id' => $request->stall_id,
                'date' => $request->date,
                'shift' => $request->shift
            ]);

            return response()->json($permit, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function myPermits()
    {
        return TemporaryPermit::with('stall')
            ->where('vendor_id', Auth::id())
            ->orderBy('date_start', 'desc')
            ->get();
    }

    public function verify($qr)
    {
        $permit = TemporaryPermit::with(['vendor', 'stall'])
            ->where('qr_code', $qr)
            ->where('status', 'active')
            ->first();

        if (!$permit) {
            return response()->json(['valid' => false, 'message' => 'QR Code tidak valid atau sudah tidak aktif.'], 404);
        }

        return response()->json([
            'valid' => true,
            'vendor' => $permit->vendor,
            'stall' => $permit->stall,
            'shift' => $permit->shift,
            'date' => $permit->date_start
        ]);
    }
}
