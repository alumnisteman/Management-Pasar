<?php

namespace App\Http\Controllers;

use App\Models\Porter;
use App\Models\PorterJob;
use App\Models\PorterIncentive;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PorterController extends Controller
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @return Porter|\Illuminate\Database\Eloquent\Collection|JsonResponse
     */
    public function index(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        if ($request->has('id')) {
            return Porter::find($request->input('id'));
        }
        return Porter::orderBy('created_at', 'desc')->get();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function live(Request $request): JsonResponse
    {
        /** @var \Illuminate\Http\Request $request */
        // Simulates live location of active porters
        $porters = Porter::where('status', 'available')->orWhere('status', 'active')->get();

        $liveData = $porters->map(function (Porter $porter) {
            return [
                'id'           => $porter->id,
                'name'         => $porter->name,
                'status'       => $porter->status,
                'lat'          => -6.200000 + (mt_rand(-50, 50) / 10000),
                'lng'          => 106.816666 + (mt_rand(-50, 50) / 10000),
                'last_updated' => \date('H:i:s'),
            ];
        });

        return \response()->json($liveData);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return Porter
     */
    public function store(Request $request): Porter
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validate([
            'name'         => 'required|string',
            'id_number'    => 'required|string|unique:porters',
            'phone'        => 'required|string',
            'daily_target' => 'nullable|numeric',
        ]);

        return Porter::create($data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return Porter
     */
    public function update(Request $request): Porter
    {
        /** @var \Illuminate\Http\Request $request */
        /** @var Porter $porter */
        $porter = Porter::findOrFail($request->input('id'));
        $porter->update($request->only('name', 'id_number', 'phone', 'status', 'rating', 'daily_earnings'));
        return $porter;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getJobs(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $query = PorterJob::query();
        if ($request->has('porterId')) {
            $query->where('porter_id', $request->input('porterId'));
        }
        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return PorterJob
     */
    public function storeJob(Request $request): PorterJob
    {
        /** @var \Illuminate\Http\Request $request */
        /** @var PorterJob $job */
        $job = PorterJob::create($request->all());
        // If job is created, update porter status to active
        Porter::where('id', $job->porter_id)->update(['status' => 'active']);
        return $job;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return PorterJob
     */
    public function updateJob(Request $request): PorterJob
    {
        /** @var \Illuminate\Http\Request $request */
        /** @var PorterJob $job */
        $job = PorterJob::findOrFail($request->input('id'));
        $job->update($request->only('status', 'rating', 'feedback'));

        if ($request->input('status') === 'completed') {
            /** @var Porter $porter */
            $porter = Porter::find($job->porter_id);
            $porter->daily_earnings += $job->fee;
            $porter->status = 'available';
            $porter->save();
        }

        return $job;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return PorterIncentive|\Illuminate\Database\Eloquent\Collection|array
     */
    public function getIncentives(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        if ($request->input('recalculate')) {
            return $this->calculateIncentive($request->input('porterId'));
        }
        return PorterIncentive::where('porter_id', $request->input('porterId'))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return PorterIncentive
     */
    public function storeIncentive(Request $request): PorterIncentive
    {
        /** @var \Illuminate\Http\Request $request */
        return PorterIncentive::create($request->all());
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRatings(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        return PorterJob::where('porter_id', $request->input('porterId'))
            ->whereNotNull('rating')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return PorterJob
     */
    public function storeRating(Request $request): PorterJob
    {
        /** @var \Illuminate\Http\Request $request */
        /** @var PorterJob $job */
        $job = PorterJob::findOrFail($request->input('job_id'));
        $job->update($request->only('rating', 'feedback'));

        // Recalculate porter average rating
        $avg = PorterJob::where('porter_id', $job->porter_id)->whereNotNull('rating')->avg('rating');
        Porter::where('id', $job->porter_id)->update(['rating' => $avg]);

        return $job;
    }

    /**
     * @param  int|string  $porterId
     * @return array
     */
    private function calculateIncentive($porterId): array
    {
        $porter   = Porter::find($porterId);
        $weekStart = Carbon::now()->startOfWeek()->toDateString();
        $weekEnd   = Carbon::now()->endOfWeek()->toDateString();

        $jobs = PorterJob::where('porter_id', $porterId)
            ->where('status', 'completed')
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->get();

        $jobsCount    = $jobs->count();
        $avgRating    = $jobs->avg('rating') ?: 5.0;
        $totalEarnings = $jobs->sum('fee');

        // Mock days hit target
        $daysHit = rand(1, 6);

        $tier  = 'none';
        $bonus = 0;

        if ($jobsCount >= 50 && $avgRating >= 4.8) {
            $tier = 'platinum'; $bonus = 150000;
        } elseif ($jobsCount >= 30 && $avgRating >= 4.5) {
            $tier = 'gold'; $bonus = 100000;
        } elseif ($jobsCount >= 15 && $avgRating >= 4.0) {
            $tier = 'silver'; $bonus = 60000;
        } elseif ($jobsCount >= 5) {
            $tier = 'bronze'; $bonus = 30000;
        }

        return [
            'porterId'    => $porterId,
            'weekStart'   => $weekStart,
            'weekEnd'     => $weekEnd,
            'jobsCompleted' => $jobsCount,
            'avgRating'   => $avgRating,
            'totalEarnings' => $totalEarnings,
            'daysHitTarget' => $daysHit,
            'tier'        => $tier,
            'bonus'       => $bonus,
            'progress'    => [
                'jobs'         => $jobsCount,
                'jobsNextTier' => 50,
                'rating'       => $avgRating,
                'ratingNextTier' => 4.8,
                'daysHit'      => $daysHit,
                'daysNextTier' => 6,
            ],
        ];
    }
}
