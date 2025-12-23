<?php

namespace App\Policies;

use App\Models\User;
use App\Models\phonenumber;
use Illuminate\Auth\Access\Response;

class PhonenumberPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, phonenumber $phonenumber): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(?User $user, phonenumber $phonenumber): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(?User $user, phonenumber $phonenumber): bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(?User $user, phonenumber $phonenumber): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(?User $user, phonenumber $phonenumber): bool
    {
        return true;
    }
}
