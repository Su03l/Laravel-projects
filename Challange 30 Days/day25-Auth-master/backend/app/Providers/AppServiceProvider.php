<?php

namespace App\Providers;

use App\Interfaces\OtpServiceInterface;
use App\Services\LogOtpService;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        //  جملة الربط السحرية
        // معناها: يا لارافيل، كل ما أحد طلب الانترفيس OtpServiceInterface، عطهم LogOtpService
        $this->app->bind(OtpServiceInterface::class, LogOtpService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer')
            );
        });
    }
}
