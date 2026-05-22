<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RssService;

class RssFetchCommand extends Command
{
    protected $signature = 'news:fetch-rss';
    protected $description = 'Fetch news from RSS sources';

    public function handle(RssService $rssService)
    {
        $sources = [
            'https://www.cnnindonesia.com/rss',
            'https://rss.kompas.com',
            'https://www.antaranews.com/rss',
            'https://feeds.feedburner.com/detikcom'
        ];

        foreach ($sources as $source) {
            $this->info("Fetching from $source...");
            try {
                $rssService->fetch($source);
            } catch (\Exception $e) {
                $this->error("Failed to fetch $source: " . $e->getMessage());
            }
        }
        
        $this->info("RSS fetching completed.");
    }
}
