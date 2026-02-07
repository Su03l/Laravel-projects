<?php

namespace App\Enums;

enum UserStatus: string
{
    case PENDING = 'pending'; // سجل بس ما دخل الكود
    case ACTIVE = 'active';   // دخل الكود واموره طيبة
    case BANNED = 'banned';   // محظور
}
