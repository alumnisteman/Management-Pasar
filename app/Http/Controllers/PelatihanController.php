<?php

namespace App\Http\Controllers;

use App\Models\Pelatihan;
use App\Models\Trader;
use Illuminate\Http\Request;
use App\Services\AuditLogger;

class PelatihanController extends Controller
{
    public function index()
    {
        return Pelatihan::withCount('traders')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'pemateri' => 'required|string',
            'kategori' => 'required|string',
            'lokasi' => 'required|string',
        ]);

        $pelatihan = Pelatihan::create($data);

        AuditLogger::log('CREATE_TRAINING', [
            'training_id' => $pelatihan->id,
            'judul' => $pelatihan->judul
        ]);

        return response()->json($pelatihan, 201);
    }

    public function registerTrader(Request $request, $id)
    {
        $request->validate([
            'trader_id' => 'required|exists:traders,id'
        ]);

        $pelatihan = Pelatihan::findOrFail($id);
        $pelatihan->traders()->attach($request->trader_id);

        AuditLogger::log('REGISTER_TRADER_TRAINING', [
            'training_id' => $pelatihan->id,
            'trader_id' => $request->trader_id
        ]);

        return response()->json(['message' => 'Pedagang berhasil terdaftar di pelatihan']);
    }

    public function updateStatus(Request $request, $id, $traderId)
    {
        $request->validate([
            'status_hadir' => 'required|string',
            'sertifikat' => 'nullable|string'
        ]);

        $pelatihan = Pelatihan::findOrFail($id);
        $pelatihan->traders()->updateExistingPivot($traderId, [
            'status_hadir' => $request->status_hadir,
            'sertifikat' => $request->sertifikat
        ]);

        return response()->json(['message' => 'Status kehadiran diperbarui']);
    }
}
