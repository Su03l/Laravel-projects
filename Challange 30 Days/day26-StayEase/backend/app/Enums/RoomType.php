<?php

namespace App\Enums;

enum RoomType: string
{
    case STANDARD = 'standard';
    case DOUBLE = 'double';
    case SUITE = 'suite';
    case ROYAL_SUITE = 'royal_suite';
    case HONEYMOON = 'honeymoon';
}
