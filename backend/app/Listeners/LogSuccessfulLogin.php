<?php

namespace App\Listeners;

use App\Models\LoginHistory;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue; 
use Illuminate\Http\Request; 
use Illuminate\Queue\InteractsWithQueue;
use Stevebauman\Location\Facades\Location;

class LogSuccessfulLogin
{

    protected Request $request;

    /**
     * Create the event listener.
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
 
        $ipAddress = $this->request->ip();
        $city = null;
        $countryName = null;
        $countryCode = null;

        if ($position = Location::get($ipAddress)) {
            $city = $position->cityName;
            $countryName = $position->countryName;
            $countryCode = $position->countryCode;
        } else {
            Log::info('GeoIP lookup failed or IP is not usable.', ['ip' => $ipAddress]);
        }

        LoginHistory::create([
            'user_id' => $event->user->id,
            'ip_address' => $ipAddress, 
            'user_agent' => $this->request->userAgent(),
            'city' => $city,  
            'country_iso_code' => $countryCode, 
            'country_name' => $countryName, 
            'login_at' => now(),
        ]);
    }
}