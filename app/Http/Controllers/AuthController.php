<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     */
    public function login(Request $request)
    {
        $email = trim($request->input('email'));
        $password = trim($request->input('password'));

        if ($email === 'admin@svms.id' && $password === 'admin123') {
            return \response()->json(['status' => 'success', 'token' => 'SVMS-ADMIN-TOKEN', 'user' => ['name' => 'Admin Utama', 'role' => 'admin']]);
        }
        if ($email === 'officer@svms.id' && $password === 'officer123') {
            return \response()->json(['status' => 'success', 'token' => 'SVMS-OFFICER-TOKEN', 'user' => ['name' => 'Petugas Lapangan', 'role' => 'officer']]);
        }

        return \response()->json(['error' => 'Invalid credentials', 'received' => ['email' => $email]], 401);
    }

    public function verifyPin(Request $request)
    {
        $data = $request->validate([
            'pin' => 'required|string|size:4'
        ]);

        // Hardcoded Master PIN for Demo/Enterprise v6.0
        if ($data['pin'] === '2026') {
            return \response()->json(['status' => 'success']);
        }

        return \response()->json(['error' => 'PIN Salah! Akses Ditolak.'], 403);
    }

    /**
     * Get the authenticated User.
     */
    public function me()
    {
        return \response()->json(\auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        \auth('api')->logout();

        return \response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     */
    protected function respondWithToken($token)
    {
        return \response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => \auth('api')->factory()->getTTL() * 60
        ]);
    }
}
