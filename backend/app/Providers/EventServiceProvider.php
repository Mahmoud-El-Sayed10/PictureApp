<?php

namespace App\Providers;

// Correct base class for event handling
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

// Default Laravel events/listeners (optional but common)
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;

// --- You will add your event/listener imports here later ---
use Illuminate\Auth\Events\Login;
use App\Listeners\LogSuccessfulLogin;
// --- End imports ---

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Default mapping (optional)
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        // --- Add your mapping here ---
        Login::class => [
            LogSuccessfulLogin::class,
        ],
        // --- End mapping ---
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // You usually don't need to add anything here for basic mapping
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     * Set to false to rely solely on the $listen array mappings.
     * Set to true to enable auto-discovery based on naming conventions.
     *
     * @return bool
     */
    public function shouldDiscoverEvents(): bool
    {
        return false; // Explicit mapping is often clearer
    }
}