<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property string $id
 * @property string|null $user_id
 * @property string|null $device_id
 * @property string|null $module
 * @property string $action
 * @property array<array-key, mixed>|null $data
 * @property array<array-key, mixed>|null $payload
 * @property string|null $ip_address
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereModule($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserId($value)
 */
	class AuditLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $trader_id
 * @property string $slot_id
 * @property numeric $amount
 * @property string $due_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Payment> $payments
 * @property-read int|null $payments_count
 * @property-read \App\Models\Vendor|null $vendor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereSlotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereTraderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bill whereUpdatedAt($value)
 */
	class Bill extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $market_id
 * @property string|null $zona_id
 * @property string $name
 * @property string|null $kode_blok
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $lantai
 * @property int $kapasitas
 * @property-read \App\Models\Market|null $market
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stall> $stalls
 * @property-read int|null $stalls_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereKapasitas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereKodeBlok($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereLantai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Block whereZonaId($value)
 */
	class Block extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $market_id
 * @property string|null $zone_id
 * @property string $category
 * @property string $description
 * @property string|null $photo
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Market $market
 * @property-read \App\Models\Zone|null $zone
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint wherePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Complaint whereZoneId($value)
 */
	class Complaint extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $name
 * @property string|null $assigned_user_id
 * @property string|null $platform
 * @property string|null $last_sync_at
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereAssignedUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereLastSyncAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Device whereUpdatedAt($value)
 */
	class Device extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GridSlot> $slots
 * @property-read int|null $slots_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Grid newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Grid newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Grid query()
 */
	class Grid extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SlotBooking> $bookings
 * @property-read int|null $bookings_count
 * @property-read \App\Models\Grid|null $grid
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GridSlot newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GridSlot newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GridSlot query()
 */
	class GridSlot extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string|null $kode_pasar
 * @property string $name
 * @property string|null $address
 * @property float|null $latitude
 * @property float|null $longitude
 * @property bool $is_active
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Slot> $slots
 * @property-read int|null $slots_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Trader> $traders
 * @property-read int|null $traders_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Zone> $zones
 * @property-read int|null $zones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereKodePasar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereUpdatedAt($value)
 */
	class Market extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string|null $user_id
 * @property string $type
 * @property string $title
 * @property string $message
 * @property bool $is_read
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUserId($value)
 */
	class Notification extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string $device_id
 * @property numeric $latitude
 * @property numeric $longitude
 * @property \Illuminate\Support\Carbon $pinged_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog wherePingedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PatrolLog whereUserId($value)
 */
	class PatrolLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string|null $bill_id
 * @property string|null $transaction_id
 * @property string $payment_method
 * @property float $amount_paid
 * @property \Illuminate\Support\Carbon $paid_at
 * @property string|null $receipt_url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $metode
 * @property string|null $petugas_id
 * @property string|null $foto_bukti
 * @property-read \App\Models\Bill|null $bill
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereAmountPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereBillId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereFotoBukti($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereMetode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePetugasId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereReceiptUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereUpdatedAt($value)
 */
	class Payment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $judul
 * @property \Illuminate\Support\Carbon $tanggal
 * @property string $pemateri
 * @property string $kategori
 * @property string $lokasi
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Trader> $traders
 * @property-read int|null $traders_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereJudul($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereKategori($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereLokasi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan wherePemateri($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pelatihan withoutTrashed()
 */
	class Pelatihan extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $trader_id
 * @property string $slot_id
 * @property string $permit_number
 * @property string $qr_code_payload
 * @property \Illuminate\Support\Carbon $issued_at
 * @property \Illuminate\Support\Carbon $expires_at
 * @property string $status
 * @property bool $is_digital
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \App\Models\Slot $slot
 * @property-read \App\Models\Trader $trader
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereIsDigital($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereIssuedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit wherePermitNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereQrCodePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereSlotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereTraderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Permit whereUpdatedAt($value)
 */
	class Permit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Stall|null $stall
 * @property-read \App\Models\Vendor|null $vendor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PermitRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PermitRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PermitRequest query()
 */
	class PermitRequest extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $id_number
 * @property string $phone
 * @property string $status
 * @property numeric $rating
 * @property numeric $daily_earnings
 * @property numeric $daily_target
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PorterIncentive> $incentives
 * @property-read int|null $incentives_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PorterJob> $jobs
 * @property-read int|null $jobs_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereDailyEarnings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereDailyTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereIdNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Porter withoutTrashed()
 */
	class Porter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $porter_id
 * @property string $week_start
 * @property string $week_end
 * @property int $jobs_completed
 * @property numeric $avg_rating
 * @property numeric $total_earnings
 * @property int $days_hit_target
 * @property string $tier
 * @property numeric $bonus_amount
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Porter|null $porter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereAvgRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereBonusAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereDaysHitTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereJobsCompleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive wherePorterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereTier($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereTotalEarnings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereWeekEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterIncentive whereWeekStart($value)
 */
	class PorterIncentive extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $porter_id
 * @property string|null $customer_name
 * @property string $location_from
 * @property string $location_to
 * @property string $weight_category
 * @property numeric $fee
 * @property string $status
 * @property int|null $rating
 * @property string|null $feedback
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Porter|null $porter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereFeedback($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereLocationFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereLocationTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob wherePorterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob whereWeightCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PorterJob withoutTrashed()
 */
	class PorterJob extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $commodity_name
 * @property float $price
 * @property \Illuminate\Support\Carbon $recorded_at
 * @property string|null $slot_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Slot|null $slot
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereCommodityName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereRecordedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereSlotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PriceLog whereUpdatedAt($value)
 */
	class PriceLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $transaction_id
 * @property string $receipt_number
 * @property string|null $printed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt wherePrintedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereReceiptNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereUpdatedAt($value)
 */
	class Receipt extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $permit_number
 * @property numeric|null $lat
 * @property numeric|null $lng
 * @property \Illuminate\Support\Carbon $scanned_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereLat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereLng($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog wherePermitNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereScannedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereUserId($value)
 */
	class ScanLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string $group
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereValue($value)
 */
	class Setting extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $market_id
 * @property string $zone_id
 * @property string|null $block_id
 * @property string $code
 * @property string|null $kode_lapak
 * @property string|null $owner_name
 * @property int $x_position
 * @property int $y_position
 * @property string $type
 * @property string|null $category
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $tipe
 * @property numeric $panjang
 * @property numeric $lebar
 * @property string|null $koordinat_x
 * @property string|null $koordinat_y
 * @property string|null $qr_code
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PriceLog> $priceLogs
 * @property-read int|null $price_logs_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereBlockId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereKodeLapak($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereKoordinatX($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereKoordinatY($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereLebar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereOwnerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot wherePanjang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereQrCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereTipe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereXPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereYPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Slot whereZoneId($value)
 */
	class Slot extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\GridSlot|null $slot
 * @property-read \App\Models\Vendor|null $vendor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlotBooking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlotBooking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlotBooking query()
 */
	class SlotBooking extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $market_id
 * @property int $block_id
 * @property string $code
 * @property numeric|null $lat
 * @property numeric|null $lng
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Block|null $block
 * @property-read \App\Models\Market|null $market
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Trader> $traders
 * @property-read int|null $traders_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereBlockId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereLat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereLng($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stall whereUpdatedAt($value)
 */
	class Stall extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $device_id
 * @property int $success_count
 * @property int $failed_count
 * @property string $sync_started_at
 * @property string|null $sync_finished_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereFailedCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereSuccessCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereSyncFinishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereSyncStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SyncLog whereUpdatedAt($value)
 */
	class SyncLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\TemporaryStall|null $stall
 * @property-read \App\Models\Vendor|null $vendor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryPermit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryPermit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryPermit query()
 */
	class TemporaryPermit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TemporaryPermit> $permits
 * @property-read int|null $permits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryStall newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryStall newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TemporaryStall query()
 */
	class TemporaryStall extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $market_id
 * @property int|null $stall_id
 * @property string $name
 * @property string|null $nik
 * @property string|null $permit_number
 * @property string|null $phone
 * @property string $type
 * @property string $status
 * @property numeric $arrears
 * @property \Illuminate\Support\Carbon|null $expired_at
 * @property string|null $address
 * @property string|null $scale
 * @property string|null $location_type
 * @property int $reputation_score
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property string|null $jenis_dagangan
 * @property string|null $tanggal_masuk
 * @property string|null $foto
 * @property-read \App\Models\Market $market
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Permit> $permits
 * @property-read int|null $permits_count
 * @property-read \App\Models\Stall|null $stall
 * @property-read \App\Models\Wallet|null $wallet
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereArrears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereExpiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereFoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereJenisDagangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereLocationType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereNik($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader wherePermitNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereReputationScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereScale($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereStallId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereTanggalMasuk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Trader whereUpdatedAt($value)
 */
	class Trader extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $local_id
 * @property string $market_id
 * @property string $slot_id
 * @property string $trader_id
 * @property string $officer_id
 * @property string $device_id
 * @property numeric $amount
 * @property string $payment_method
 * @property \Illuminate\Support\Carbon $transaction_time
 * @property \Illuminate\Support\Carbon|null $server_time
 * @property string $status
 * @property string|null $receipt_number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereLocalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereOfficerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereReceiptNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereServerTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereSlotId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTraderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTransactionTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 */
	class Transaction extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string|null $market_id
 * @property string|null $device_id
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Market|null $market
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastLoginAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Tymon\JWTAuth\Contracts\JWTSubject {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PermitRequest> $permitRequests
 * @property-read int|null $permit_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Permit> $permits
 * @property-read int|null $permits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor query()
 */
	class Vendor extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $trader_id
 * @property float $balance
 * @property string $currency
 * @property int $is_frozen
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Trader $trader
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereIsFrozen($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereTraderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereUpdatedAt($value)
 */
	class Wallet extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $wallet_id
 * @property string $type
 * @property numeric $amount
 * @property string|null $description
 * @property string|null $reference_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereWalletId($value)
 */
	class WalletTransaction extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string|null $pelapor
 * @property string $terlapor
 * @property string $laporan
 * @property string|null $bukti_foto
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereBuktiFoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereLaporan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport wherePelapor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereTerlapor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WhistleblowerReport whereUpdatedAt($value)
 */
	class WhistleblowerReport extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $market_id
 * @property string|null $kode_zona
 * @property string $name
 * @property string $jenis_zona
 * @property string|null $description
 * @property string|null $color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $prioritas
 * @property-read \App\Models\Market $market
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Slot> $slots
 * @property-read int|null $slots_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereJenisZona($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereKodeZona($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereMarketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone wherePrioritas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Zone whereUpdatedAt($value)
 */
	class Zone extends \Eloquent {}
}

