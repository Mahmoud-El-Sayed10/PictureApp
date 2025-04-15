<?php

namespace App\Listeners;

use App\Models\LoginHistory;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue; 
use Illuminate\Http\Request; 
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{

    protected Request $request;

    /**
     * Create the event listener. Inject Request.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {

        if ($event->user) {
            LoginHistory::create([
                'user_id' => $event->user->id,
                'ip_address' => $this->request->ip(),
                'user_agent' => $this->request->userAgent(),
                'login_at' => now(),
            ]);
        }
    }
}