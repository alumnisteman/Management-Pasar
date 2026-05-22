<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\News;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScrapeNewsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $newsId;

    public function __construct($newsId)
    {
        $this->newsId = $newsId;
    }

    public function handle()
    {
        $news = News::find($this->newsId);
        if (!$news || $news->scraped_at != null) {
            return; // Already scraped or not found
        }

        $url = $news->link;
        Log::info("[ScrapeNewsJob] Processing news ID {$this->newsId} from URL: {$url}");

        try {
            // Call the scraper container via HTTP
            $response = Http::timeout(45)->get('http://scraper:3000/scrape', [
                'url' => $url
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data && isset($data['status']) && $data['status'] === 'success') {
                    $content = $data['data']['content'] ?? '';
                    $image = $data['data']['image'] ?? null;

                    Log::info("[ScrapeNewsJob] Scraper returned success. Content length: " . strlen($content) . ", Image: " . ($image ?? 'none'));

                    // --- AI SUMMARIZATION (OpenRouter) ---
                    $openRouterKey = env('OPENROUTER_API_KEY');
                    if ($openRouterKey && $content) {
                        Log::info("[ScrapeNewsJob] OpenRouter API Key found. Requesting AI Summary...");
                        $aiResponse = Http::withHeaders([
                            'Authorization' => 'Bearer ' . $openRouterKey
                        ])->post('https://openrouter.ai/api/v1/chat/completions', [
                            'model' => 'deepseek/deepseek-chat',
                            'messages' => [
                                ['role' => 'user', 'content' => "Ringkas berita ini ke dalam 2-3 paragraf padat: " . $content]
                            ]
                        ]);

                        if ($aiResponse->successful()) {
                            $summary = $aiResponse->json()['choices'][0]['message']['content'] ?? null;
                            if ($summary) {
                                $content = $summary;
                                Log::info("[ScrapeNewsJob] AI Summary created successfully.");
                            }
                        } else {
                            Log::warning("[ScrapeNewsJob] AI Summarization request failed: " . $aiResponse->status() . " - " . $aiResponse->body());
                        }
                    }

                    $news->update([
                        'content' => $content,
                        'image' => $image ?? $news->image,
                        'scraped_at' => now()
                    ]);

                    Log::info("[ScrapeNewsJob] Updated database record for news ID {$this->newsId} successfully.");
                } else {
                    Log::error("[ScrapeNewsJob] Scraper returned failure response: " . json_encode($data));
                }
            } else {
                Log::error("[ScrapeNewsJob] Scraper request failed with HTTP status: " . $response->status());
            }
        } catch (\Exception $e) {
            Log::error("[ScrapeNewsJob] Exception occurred during scraping/summarization for news ID {$this->newsId}: " . $e->getMessage());
        }
    }
}
