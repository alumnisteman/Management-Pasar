<?php

namespace App\Logging;

use Monolog\Logger;

class TelegramLogger
{
    /**
     * Create a custom Monolog instance.
     */
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('telegram');
        $logger->pushHandler(new TelegramHandler($config['level'] ?? Logger::ERROR));

        return $logger;
    }
}
