<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'model_type' => 'User',
            'model_id' => $user->id,
            'description' => 'User login ke sistem',
        ]);

        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name,
                'role_display' => $user->role->display_name,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logout',
            'model_type' => 'User',
            'model_id' => $request->user()->id,
            'description' => 'User logout dari sistem',
        ]);

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->name,
            'role_display' => $user->role->display_name,
        ]);
    }
}
