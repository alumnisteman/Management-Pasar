<?php

namespace App\Http\Controllers;

use App\Models\Porter;
use App\Models\PorterJob;
use App\Models\PorterIncentive;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PorterController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('id')) {
            return Porter::find($request->id);
        }
        return Porter::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'id_number' => 'required|string|unique:porters',
            'phone' => 'required|string',
            'daily_target' => 'nullable|numeric'
        ]);
        
        return Porter::create($data);
    }

    public function update(Request $request)
    {
        $porter = Porter::findOrFail($request->id);
        $porter->update($request->only('status', 'rating', 'daily_earnings'));
        return $porter;
    }

    public function getJobs(Request $request)
    {
        $query = PorterJob::query();
        if ($request->has('porterId')) {
            $query->where('porter_id', $request->porterId);
        }
        return $query->orderBy('created_at', 'desc')->get();
    }

    public function storeJob(Request $request)
    {
        $job = PorterJob::create($request->all());
        // If job is created, update porter status to active
        Porter::where('id', $job->porter_id)->update(['status' => 'active']);
        return $job;
    }

    public function updateJob(Request $request)
    {
        $job = PorterJob::findOrFail($request->id);
        $job->update($request->only('status', 'rating', 'feedback'));
        
        if ($request->status === 'completed') {
            $porter = Porter::find($job->porter_id);
            $porter->daily_earnings += $job->fee;
            $porter->status = 'available';
            $porter->save();
        }
        
        return $job;
    }

    public function getIncentives(Request $request)
    {
        if ($request->recalculate) {
            return $this->calculateIncentive($request->porterId);
        }
        return PorterIncentive::where('porter_id', $request->porterId)->orderBy('created_at', 'desc')->get();
    }

    public function storeIncentive(Request $request)
    {
        return PorterIncentive::create($request->all());
    }

    public function getRatings(Request $request)
    {
        return PorterJob::where('porter_id', $request->porterId)
            ->whereNotNull('rating')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
    }

    public function storeRating(Request $request)
    {
        $job = PorterJob::findOrFail($request->job_id);
        $job->update($request->only('rating', 'feedback'));
        
        // Recalculate porter average rating
        $avg = PorterJob::where('porter_id', $job->porter_id)->whereNotNull('rating')->avg('rating');
        Porter::where('id', $job->porter_id)->update(['rating' => $avg]);
        
        return $job;
    }

    private function calculateIncentive($porterId)
    {
        $porter = Porter::find($porterId);
        $weekStart = Carbon::now()->startOfWeek()->toDateString();
        $weekEnd = Carbon::now()->endOfWeek()->toDateString();
        
        $jobs = PorterJob::where('porter_id', $porterId)
            ->where('status', 'completed')
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->get();
            
        $jobsCount = $jobs->count();
        $avgRating = $jobs->avg('rating') ?: 5.0;
        $totalEarnings = $jobs->sum('fee');
        
        // Mock days hit target
        $daysHit = rand(1, 6); 
        
        $tier = 'none';
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
            'porterId' => $porterId,
            'weekStart' => $weekStart,
            'weekEnd' => $weekEnd,
            'jobsCompleted' => $jobsCount,
            'avgRating' => $avgRating,
            'totalEarnings' => $totalEarnings,
            'daysHitTarget' => $daysHit,
            'tier' => $tier,
            'bonus' => $bonus,
            'progress' => [
                'jobs' => $jobsCount,
                'jobsNextTier' => 50,
                'rating' => $avgRating,
                'ratingNextTier' => 4.8,
                'daysHit' => $daysHit,
                'daysNextTier' => 6
            ]
        ];
    }
}
