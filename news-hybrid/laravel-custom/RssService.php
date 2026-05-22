<?php

namespace App\Services;

use Vedmant\FeedReader\Facades\FeedReader;
use App\Models\News;
use App\Jobs\ScrapeNewsJob;

class RssService
{
    public function fetch($url)
    {
        $feed = FeedReader::read($url);

        if (!$feed || !$feed->get_items()) {
            return;
        }

        foreach ($feed->get_items() as $item) {
            $link = $item->get_link();
            if (!$link) continue;

            $title = $item->get_title();
            $hash = md5(strtolower($title));

            // Prevent duplicate insertion
            if (News::where('hash', $hash)->exists()) {
                continue;
            }

            $news = News::updateOrCreate([
                'link' => $link
            ],[
                'title' => $title,
                'excerpt' => strip_tags($item->get_description()),
                'published_at' => $item->get_date('Y-m-d H:i:s'),
                'source' => parse_url($link, PHP_URL_HOST),
                'hash' => $hash,
                'category' => 'Uncategorized' // Default
            ]);

            // Dispatch scraper job to get full content and image
            ScrapeNewsJob::dispatch($news->id);
        }
    }
}
