<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'city',
        'country_iso_code',
        'country_name',   
        'login_at',
    ];

    protected $casts = [
        'login_at' => 'datetime',
    ];  

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
