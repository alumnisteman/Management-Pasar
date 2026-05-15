<?php

/**
 * Extra IDE Helper to silence false positives for missing vendor/ directory
 */

namespace Illuminate\Support {
    class Str {
        /**
         * Generate a UUID (version 4).
         * @return mixed
         */
        public static function uuid() { return null; }
    }
}

namespace {
    /**
     * Get the evaluated view contents for the given view.
     * @return mixed
     */
    function view($view = null, $data = [], $mergeData = []) { return null; }

    /**
     * Return a new response from the application.
     * @return mixed
     */
    function response($content = '', $status = 200, array $headers = []) { return null; }

    /**
     * Create a new Carbon instance for the current time.
     * @return mixed
     */
    function now($tz = null) { return null; }
}
