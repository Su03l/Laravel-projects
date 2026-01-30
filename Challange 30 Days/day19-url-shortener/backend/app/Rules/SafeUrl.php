<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeUrl implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // 1. منع اختصار روابط السيرفر المحلي (Localhost)
        if (str_contains($value, 'localhost') || str_contains($value, '127.0.0.1')) {
            $fail('غير مسموح باختصار الروابط المحلية.');
            return;
        }

        // 2. منع اختصار دومين موقعنا نفسه (عشان ما يصير Loop لانهائي)
        // لنفترض أن موقعك هو my-shortener.com
        if (str_contains($value, 'my-shortener.com')) { // غيرها لاسم موقعك
            $fail('لا يمكنك اختصار رابط مختصر أصلاً!');
            return;
        }

        // 3. (متقدم) هنا المفروض نرسل الرابط لـ Google API
        // الكود أدناه مجرد مثال لو عندك API Key
        /*
        $isSafe = GoogleSafeBrowsing::check($value);
        if (!$isSafe) {
            $fail('هذا الرابط تم تصنيفه كخطر ولا يمكن اختصاره.');
        }
        */

        // 4. فحص بسيط لقائمة سوداء يدوية (Blacklist)
        $blacklistedDomains = ['hacker.com', 'virus.net', 'bad-site.org'];
        $domain = parse_url($value, PHP_URL_HOST);

        if (in_array($domain, $blacklistedDomains)) {
            $fail('هذا الموقع محظور لأسباب أمنية.');
        }
    }
}
