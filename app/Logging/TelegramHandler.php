<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Logger;
use Monolog\LogRecord;
use Illuminate\Support\Facades\Http;

class TelegramHandler extends AbstractProcessingHandler
{
    protected string $token;
    protected string $chatId;

    public function __construct($level = Logger::ERROR, bool $bubble = true)
    {
        parent::__construct($level, $bubble);
        
        $this->token = env('TELEGRAM_BOT_TOKEN', '8637858296:AAGjCWCgWMT7u_xpv7AMdRcH7wDQg54G3rI');
        $this->chatId = env('TELEGRAM_CHAT_ID', '1256469793');
    }

    protected function write(LogRecord $record): void
    {
        if (!$this->token || !$this->chatId) {
            return;
        }

        $appName = env('APP_NAME', 'SMOS Enterprise');
        
        $message = "🚨 *{$appName} Alert*\n\n";
        $message .= "Level: *{$record->level->getName()}*\n";
        $message .= "Message: `{$record->message}`\n\n";
        
        if (!empty($record->context)) {
            $context = json_encode($record->context, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            // Batasi panjang konteks agar tidak error API Telegram
            if (strlen($context) > 2000) {
                $context = substr($context, 0, 2000) . '...';
            }
            $message .= "Context:\n```json\n{$context}\n```";
        }

        try {
            Http::timeout(5)->post("https://api.telegram.org/bot{$this->token}/sendMessage", [
                'chat_id' => $this->chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
                'disable_web_page_preview' => true,
            ]);
        } catch (\Exception $e) {
            // Silently fail if telegram API is down
        }
    }
}
