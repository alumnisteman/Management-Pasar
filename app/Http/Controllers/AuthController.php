<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $email = trim($request->input('email'));
        $password = trim($request->input('password'));

        if ($email === 'admin@svms.id' && $password === 'admin123') {
            return response()->json([
                'status' => 'success',
                'token' => 'SVMS-ADMIN-TOKEN-2026',
                'user' => ['name' => 'Admin Utama', 'role' => 'admin', 'email' => $email]
            ]);
        }
        if ($email === 'officer@svms.id' && $password === 'officer123') {
            return response()->json([
                'status' => 'success',
                'token' => 'SVMS-OFFICER-TOKEN-2026',
                'user' => ['name' => 'Petugas Lapangan', 'role' => 'officer', 'email' => $email]
            ]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function verifyPin(Request $request)
    {
        $data = $request->validate([
            'pin' => 'required|string|size:4'
        ]);

        if ($data['pin'] === '2026') {
            return response()->json(['status' => 'success']);
        }

        return response()->json(['error' => 'PIN Salah! Akses Ditolak.'], 403);
    }

    public function me(Request $request)
    {
        return response()->json([
            'name' => 'Admin SVMS',
            'role' => 'admin',
            'email' => 'admin@svms.id'
        ]);
    }

    public function logout()
    {
        return response()->json(['message' => 'Successfully logged out']);
    }
}
