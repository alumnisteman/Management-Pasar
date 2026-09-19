<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AIService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.deepseek.com/v1';

    public function __construct()
    {
        $this->apiKey = env('DEEPSEEK_API_KEY');
    }

    /**
     * Generate an intelligent summary based on market data.
     */
    public function generateSummary($data)
    {
        if (empty($this->apiKey)) {
            Log::warning('AI Service: DEEPSEEK_API_KEY is not configured.');
            return "AI Service Offline: Please configure API Key.";
        }

        $prompt = "You are an AI Market Analyst for SVMS Enterprise. Based on the following data, provide a professional, concise summary of the market's health and any critical actions needed.\n\n" . json_encode($data);

        try {
            $response = Http::withToken($this->apiKey)
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'stream' => false
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }

            Log::error('AI Service Error: ' . $response->body());
            return "AI Analysis temporarily unavailable (API Error).";
        } catch (\Exception $e) {
            Log::error('AI Service Exception: ' . $e->getMessage());
            return "AI Analysis Offline (Connection Error).";
        }
    }

    /**
     * Get system status for diagnostics.
     */
    public function getStatus()
    {
        if (empty($this->apiKey)) {
            return 'offline';
        }

        return 'online';
    }
}
