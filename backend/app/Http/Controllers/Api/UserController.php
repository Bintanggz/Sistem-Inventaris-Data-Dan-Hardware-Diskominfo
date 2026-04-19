<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return response()->json([
            'data' => $users->map(fn($u) => $this->formatUser($u)),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)],
            'role_id'  => 'required|exists:roles,id',
            'avatar'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create($validated);

        ActivityLog::log('create', 'User', $user->id, null, $user->toArray(), "Menambahkan user: {$user->name}");

        return response()->json(['message' => 'User berhasil ditambahkan', 'data' => $this->formatUser($user->load('role'))], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'role_id'  => 'required|exists:roles,id',
            'password' => ['nullable', Password::min(6)],
            'avatar'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $oldValues = $user->toArray();

        if ($request->hasFile('avatar')) {
            // Hapus avatar lama jika ada
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        ActivityLog::log('update', 'User', $user->id, $oldValues, $user->fresh()->toArray(), "Mengubah user: {$user->name}");

        return response()->json(['message' => 'User berhasil diperbarui', 'data' => $this->formatUser($user->load('role'))]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Tidak dapat menghapus akun sendiri'], 422);
        }

        // Hapus avatar dari storage
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $oldValues = $user->toArray();
        $user->delete();

        ActivityLog::log('delete', 'User', $oldValues['id'], $oldValues, null, "Menghapus user: {$oldValues['name']}");

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    public function roles(): JsonResponse
    {
        return response()->json(['data' => Role::all()]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            'role_id'      => $user->role_id,
            'role'         => $user->role?->name,
            'role_display' => $user->role?->display_name,
            'avatar_url'   => $user->avatar_url,
            'created_at'   => $user->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
