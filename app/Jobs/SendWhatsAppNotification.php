<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Services\AuditLogger;

class SendWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $phone;
    protected $message;
    protected $payload;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($phone, $message, $payload = [])
    {
        $this->phone = $phone;
        $this->message = $message;
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Simulate an external API call to WhatsApp Gateway
        // e.g., Http::post('https://api.wa.gateway/send', ['to' => $this->phone, 'text' => $this->message]);
        
        Log::info("Simulating WhatsApp send to {$this->phone}");
        
        // Simulating heavy delay
        sleep(2);
        
        AuditLogger::log('WHATSAPP_SENT', [
            'phone' => $this->phone,
            'message_excerpt' => substr($this->message, 0, 50),
            'payload' => $this->payload
        ]);
        
        Log::info("WhatsApp message successfully sent to {$this->phone}");
    }
}
