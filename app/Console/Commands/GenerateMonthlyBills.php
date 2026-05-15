<?php

namespace App\Console\Commands;

use App\Services\BillingService;
use Illuminate\Console\Command;

class GenerateMonthlyBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'retribusi:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly bills for all active market traders';

    /**
     * Execute the console command.
     */
    public function handle(BillingService $billingService)
    {
        $this->info('Starting billing generation...');
        
        $result = $billingService->generateMonthlyBills();
        
        $this->info("Billing process completed.");
        $this->info("New bills generated: " . $result['generated_count']);
        $this->info("Total amount billed: Rp " . number_format($result['total_amount']));
    }
}
