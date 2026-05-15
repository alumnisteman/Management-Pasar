<?php

/**
 * IDE Helper Stubs for Laravel classes missing from local indexing.
 * This file is for IDE static analysis only.
 */

namespace Illuminate\Http {
    class Request {
        public function validate(array $rules, array $messages = [], array $customAttributes = []): array { return []; }
        public function input(?string $key = null, mixed $default = null): mixed { return $default; }
        public function has(string $key): bool { return true; }
        public function all(?array $keys = null): array { return []; }
        public function only(...$keys): array { return []; }
        public function file(?string $key = null, mixed $default = null): mixed { return null; }
        public function header(?string $key = null, mixed $default = null): ?string { return null; }
        public function ip(): string { return ''; }
        public function method(): string { return ''; }
    }
    class JsonResponse {
        public function json(mixed $data = [], int $status = 200, array $headers = [], int $options = 0): self { return $this; }
    }
}

namespace Illuminate\Database\Eloquent {
    class Model {
        /** @var int|string */
        public $id;
        public function save(array $options = []): bool { return true; }
        public function update(array $attributes = [], array $options = []): bool { return true; }
        public function delete(): bool { return true; }
        public function increment(string $column, int $amount = 1, array $extra = []): bool { return true; }
        public function decrement(string $column, int $amount = 1, array $extra = []): bool { return true; }
        public function belongsTo(string $related, ?string $foreignKey = null, ?string $ownerKey = null, ?string $relation = null): mixed { return null; }
        public function hasMany(string $related, ?string $foreignKey = null, ?string $localKey = null): mixed { return null; }
        public function hasOne(string $related, ?string $foreignKey = null, ?string $localKey = null): mixed { return null; }
        public static function query(): Builder { return new Builder(); }
        public static function find(mixed $id, array $columns = ['*']): ?static { return new static(); }
        public static function findOrFail(mixed $id, array $columns = ['*']): static { return new static(); }
        public static function create(array $attributes = []): static { return new static(); }
        public static function where(string|array $column, mixed $operator = null, mixed $value = null, string $boolean = 'and'): Builder { return new Builder(); }
        public static function count(string|array $columns = '*'): int { return 0; }
        public static function whereMonth(string $column, mixed $operator, mixed $value = null, string $boolean = 'and'): Builder { return new Builder(); }
        public static function whereDate(string $column, mixed $operator, mixed $value = null, string $boolean = 'and'): Builder { return new Builder(); }
        public static function orderBy(string $column, string $direction = 'asc'): Builder { return new Builder(); }
        public static function with(string|array $relations): Builder { return new Builder(); }
        public static function boot(): void {}
        public static function creating(callable $callback): void {}
    }
    class Builder {
        public function where(string|array $column, mixed $operator = null, mixed $value = null, string $boolean = 'and'): self { return $this; }
        public function orWhere(string|array $column, mixed $operator = null, mixed $value = null): self { return $this; }
        public function whereBetween(string $column, array $values, string $boolean = 'and', bool $not = false): self { return $this; }
        public function orderBy(string $column, string $direction = 'asc'): self { return $this; }
        public function get(array $columns = ['*']): Collection { return new Collection(); }
        public function first(array $columns = ['*']): mixed { return null; }
        public function findOrFail(mixed $id, array $columns = ['*']): mixed { return null; }
        public function update(array $values): int { return 0; }
        public function count(string|array $columns = '*'): int { return 0; }
        public function with(string|array $relations): self { return $this; }
        public function distinct(?string $column = null): self { return $this; }
        public function select(string|array $columns = ['*']): self { return $this; }
        public function whereMonth(string $column, mixed $operator, mixed $value = null, string $boolean = 'and'): self { return $this; }
        public function whereDate(string $column, mixed $operator, mixed $value = null, string $boolean = 'and'): self { return $this; }
        public function sum(string $column): float|int { return 0; }
        public function avg(string $column): float|int { return 0; }
        public function take(int $value): self { return $this; }
        public function getQuery(): mixed { return null; }
        public function whereNotNull(string|array $column): self { return $this; }
    }
    class Collection implements \IteratorAggregate, \Countable {
        public function map(callable $callback): self { return $this; }
        public function count(): int { return 0; }
        public function sum(?string $column = null): float|int { return 0; }
        public function avg(?string $column = null): float|int { return 0; }
        public function unique(mixed $key = null, bool $strict = false): self { return $this; }
        public function getIterator(): \Traversable { return new \ArrayIterator([]); }
    }
}

namespace Illuminate\Database\Eloquent\Concerns {
    trait HasUuids {}
}

namespace Illuminate\Database\Eloquent {
    trait SoftDeletes {}
}

namespace Laravel\Scout {
    trait Searchable {}
}

namespace Illuminate\Support\Facades {
    class DB {
        public static function table(string $table): \Illuminate\Database\Eloquent\Builder { return new \Illuminate\Database\Eloquent\Builder(); }
        public static function raw(mixed $value): mixed { return $value; }
        public static function select(string $query, array $bindings = [], bool $useReadPdo = true): array { return []; }
        public static function statement(string $query, array $bindings = []): bool { return true; }
    }
    class Auth {
        public static function id(): int|string|null { return 1; }
        public static function user(): mixed { return null; }
        public static function check(): bool { return true; }
    }
    class Artisan {
        public static function call(string $command, array $parameters = [], mixed $outputBuffer = null): int { return 0; }
    }
}

namespace Carbon {
    class Carbon {
        public static function now(mixed $tz = null): self { return new static(); }
        public static function today(mixed $tz = null): self { return new static(); }
        public function startOfWeek(): self { return $this; }
        public function endOfWeek(): self { return $this; }
        public function toDateString(): string { return ''; }
        public function toDateTimeString(): string { return ''; }
        public function subMinutes(int $value): self { return $this; }
        /** @var int */
        public $month;
    }
}

namespace {
    function now(): \Carbon\Carbon { return new \Carbon\Carbon(); }
    function auth(?string $guard = null): \Illuminate\Support\Facades\Auth { return new \Illuminate\Support\Facades\Auth(); }
    function response(mixed $content = '', int $status = 200, array $headers = []): \Illuminate\Http\JsonResponse { return new \Illuminate\Http\JsonResponse(); }
    function request(mixed $key = null, mixed $default = null): \Illuminate\Http\Request { return new \Illuminate\Http\Request(); }
}
