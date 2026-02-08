<?php

namespace App\Enums;

enum PackageType: string
{
    case BASIC = 'basic';
    case HALF_BOARD = 'half_board';
    case ALL_INCLUSIVE = 'all_inclusive';
}
