<?php
$redis = new Redis();
try {
    if ($redis->connect('redis', 6379)) {
        echo "CONNECTED\n";
    } else {
        echo "FAILED\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
