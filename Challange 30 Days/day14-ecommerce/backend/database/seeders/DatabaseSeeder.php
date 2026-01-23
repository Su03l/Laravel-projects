<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create 500 Users
        User::factory(500)->create();

        // Ensure an admin user exists
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                // 'role' => 'admin', // Note: Check if 'role' column exists in your migration
            ]);
        }

        // 2. Define Categories and Real-world Products
        $data = [
            'ألعاب ستيم (Steam)' => [
                ['name' => 'Elden Ring', 'price' => 225, 'desc' => 'لعبة الأكشن وتقمص الأدوار الحائزة على جوائز.'],
                ['name' => 'Cyberpunk 2077', 'price' => 180, 'desc' => 'عالم مفتوح في مدينة المستقبل نايت سيتي.'],
                ['name' => 'Red Dead Redemption 2', 'price' => 150, 'desc' => 'ملحمة الغرب الأمريكي من روكستار.'],
                ['name' => 'Counter-Strike 2 Prime', 'price' => 56, 'desc' => 'ترقية الحساب الممتاز للعبة التصويب الأشهر.'],
                ['name' => 'Baldur\'s Gate 3', 'price' => 210, 'desc' => 'أفضل لعبة تقمص أدوار لعام 2023.'],
            ],
            'لابتوبات قيمنق' => [
                ['name' => 'ASUS ROG Zephyrus G14', 'price' => 6500, 'desc' => 'أداء قوي وحجم مدمج مع شاشة Nebula.'],
                ['name' => 'Razer Blade 15', 'price' => 8900, 'desc' => 'تصميم نحيف وأداء جبار للألعاب الثقيلة.'],
                ['name' => 'MSI Titan GT77', 'price' => 15000, 'desc' => 'وحش الأداء مع معالج i9 وكرت RTX 4090.'],
                ['name' => 'Lenovo Legion 5 Pro', 'price' => 5200, 'desc' => 'أفضل قيمة مقابل أداء في فئة القيمنق.'],
                ['name' => 'HP Victus 16', 'price' => 3800, 'desc' => 'لابتوب قيمنق للمبتدئين بأداء مستقر.'],
            ],
            'إكسسوارات كمبيوتر' => [
                ['name' => 'Logitech G Pro X Superlight', 'price' => 550, 'desc' => 'ماوس لاسلكي خفيف جداً للمحترفين.'],
                ['name' => 'SteelSeries Apex Pro', 'price' => 800, 'desc' => 'كيبورد ميكانيكي مع مفاتيح قابلة للتعديل.'],
                ['name' => 'HyperX Cloud II', 'price' => 350, 'desc' => 'سماعة الألعاب الأكثر راحة وشهرة.'],
                ['name' => 'Elgato Stream Deck MK.2', 'price' => 600, 'desc' => 'أداة التحكم المثالية لصناع المحتوى.'],
                ['name' => 'Razer Seiren V2 Pro', 'price' => 580, 'desc' => 'مايكروفون احترافي للبث المباشر.'],
            ],
            'بطاقات شحن' => [
                ['name' => 'بطاقة ستيم 50 دولار', 'price' => 195, 'desc' => 'رصيد لمحفظة ستيم العالمية.'],
                ['name' => 'بطاقة بلايستيشن 20 دولار', 'price' => 85, 'desc' => 'رصيد للمتجر السعودي.'],
                ['name' => 'اشتراك اكس بوكس قيم باس', 'price' => 45, 'desc' => 'اشتراك شهر واحد التيميت.'],
                ['name' => 'بطاقة ابل 100 ريال', 'price' => 100, 'desc' => 'رصيد لمتجر التطبيقات والخدمات.'],
                ['name' => 'بطاقة روبلوكس 2000 روبوكس', 'price' => 90, 'desc' => 'شحن مباشر لحسابك في روبلوكس.'],
            ],
            'شاشات قيمنق' => [
                ['name' => 'Samsung Odyssey G9', 'price' => 4500, 'desc' => 'شاشة منحنية فائقة العرض 49 بوصة.'],
                ['name' => 'LG UltraGear 27GP850', 'price' => 1600, 'desc' => 'شاشة Nano IPS بسرعة 165 هرتز.'],
                ['name' => 'ASUS TUF Gaming VG27AQ', 'price' => 1300, 'desc' => 'دقة 2K مع تقنية ELMB Sync.'],
                ['name' => 'Alienware AW3423DW', 'price' => 5200, 'desc' => 'أول شاشة QD-OLED في العالم.'],
                ['name' => 'BenQ ZOWIE XL2546K', 'price' => 1900, 'desc' => 'الاختيار الأول لمحترفي الـ eSports.'],
            ],
            'كراسي وطاولات قيمنق' => [
                ['name' => 'Secretlab TITAN Evo', 'price' => 2200, 'desc' => 'أفضل كرسي قيمنق من حيث الراحة والجودة.'],
                ['name' => 'Noblechairs Hero', 'price' => 1800, 'desc' => 'تصميم كلاسيكي فخم مع دعم للظهر.'],
                ['name' => 'طاولة Eureka Ergonomic Z1-S', 'price' => 750, 'desc' => 'طاولة مع إضاءة RGB وحامل أكواب.'],
                ['name' => 'كرسي Razer Iskur', 'price' => 1950, 'desc' => 'نظام دعم قطني فريد من نوعه.'],
                ['name' => 'طاولة Cougar Mars', 'price' => 1400, 'desc' => 'مساحة واسعة مع تحكم كامل بالإضاءة.'],
            ],
            'تجميعات PC جاهزة' => [
                ['name' => 'NZXT Player: One', 'price' => 3500, 'desc' => 'تجميعة مثالية لبداية عالم الـ PC.'],
                ['name' => 'Corsair Vengeance i7400', 'price' => 12000, 'desc' => 'أداء فائق مع تبريد مائي متطور.'],
                ['name' => 'Alienware Aurora R15', 'price' => 9500, 'desc' => 'تصميم فضائي فريد مع أحدث القطع.'],
                ['name' => 'Origin PC Millennium', 'price' => 14000, 'desc' => 'تخصيص كامل لأعلى مستويات الأداء.'],
                ['name' => 'Skytech Archangel', 'price' => 4200, 'desc' => 'توازن ممتاز بين السعر والأداء.'],
            ],
        ];

        foreach ($data as $categoryName => $products) {
            $category = Category::create(['name' => $categoryName]);

            // Create 50 products for each category
            for ($i = 1; $i <= 50; $i++) {
                // Pick a base product from our real-world list to keep it "real"
                $baseProduct = $products[($i - 1) % count($products)];

                Product::create([
                    'category_id' => $category->id,
                    'name' => $i > count($products) ? $baseProduct['name'] . ' - إصدار ' . $i : $baseProduct['name'],
                    'description' => $baseProduct['desc'],
                    'price' => $baseProduct['price'] + rand(-20, 50), // Slight variation in price
                    'stock' => rand(5, 100),
                    'image' => null, // Images can be added later
                ]);
            }
        }
    }
}
