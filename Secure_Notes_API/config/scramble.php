<?php

use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;

return [
    /*
     * Your API path. By default, all routes starting with this path will be added to the docs.
     */
    'api_path' => 'api',

    'api_domain' => null,

    'export_path' => 'api.json',

    'info' => [
        /*
         * API version.
         */
        'version' => '1.0.0',

        /*
         * Description rendered on the home page of the API documentation (`/docs/api`).
         */
        'description' => 'توثيق واجهة برمجة التطبيقات (API) لنظام الملاحظات الآمن. يتيح هذا النظام للمستخدمين إدارة ملاحظاتهم بخصوصية تامة مع دعم كامل لعمليات التحقق من الهوية.',
    ],

    /*
     * Customize Stoplight Elements UI
     */
    'ui' => [
        /*
         * Define the title of the documentation's website.
         */
        'title' => 'واجهة برمجة الملاحظات الآمنة',

        /*
         * Define the theme of the documentation.
         */
        'theme' => 'dark',

        'hide_try_it' => false,

        'hide_schemas' => false,

        'logo' => '',

        'try_it_credentials_policy' => 'include',

        'layout' => 'sidebar',
    ],

    'servers' => [
        'Local' => 'api',
    ],

    'enum_cases_description_strategy' => 'description',

    'enum_cases_names_strategy' => false,

    'flatten_deep_query_parameters' => true,

    'middleware' => [
        'web',
        RestrictedDocsAccess::class,
    ],

    'extensions' => [],

    'security' => [
        'type' => 'http',
        'scheme' => 'bearer',
    ],
];
