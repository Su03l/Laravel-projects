<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OpenAI API Key
    |--------------------------------------------------------------------------
    |
    | Here you may specify your OpenAI API Key. This will be used to authenticate
    | with the OpenAI API - you can find your key on your OpenAI dashboard.
    |
    */

    'api_key' => env('OPENROUTER_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | OpenAI Organization
    |--------------------------------------------------------------------------
    |
    | Here you may specify your OpenAI Organization. This will be used to
    | authenticate with the OpenAI API - you can find your organization on
    | your OpenAI dashboard.
    |
    */

    'organization' => null,

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    |
    | The timeout may be used to specify the maximum number of seconds to wait
    | for a response. By default, the client will time out after 30 seconds.
    |
    */

    'request_timeout' => 30,

    /*
    |--------------------------------------------------------------------------
    | Base URI
    |--------------------------------------------------------------------------
    |
    | The base URI to use for API requests.
    |
    */

    'base_uri' => 'https://openrouter.ai/api/v1',

];
