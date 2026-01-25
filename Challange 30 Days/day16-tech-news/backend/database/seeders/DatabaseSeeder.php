<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting database seeding in Arabic...');

        // 1. Create 1000 Users
        $this->command->info('Creating 1000 users...');
        $users = User::factory(1000)->create();

        // 2. Define Tech Categories and Sample Arabic Content
        $categoriesData = [
            'تطوير الواجهات الخلفية' => [
                'titles' => ['أفضل ممارسات بناء API باستخدام Laravel', 'مقارنة بين Node.js و Python في 2024', 'كيفية تحسين أداء قواعد البيانات الضخمة', 'شرح مفصل لنظام الـ Microservices'],
                'content' => 'يعتبر تطوير الواجهات الخلفية من أهم ركائز المواقع الحديثة، حيث يتم التعامل مع البيانات والمنطق البرمجي...'
            ],
            'تطوير الواجهات الأمامية' => [
                'titles' => ['لماذا يجب عليك تعلم React في 2024؟', 'أحدث ميزات Vue.js 3 الجديدة', 'تحسين تجربة المستخدم باستخدام Tailwind CSS', 'مستقبل تطوير الويب مع WebAssembly'],
                'content' => 'تركز الواجهات الأمامية على ما يراه المستخدم ويتفاعل معه، التقنيات الحديثة جعلت المواقع أسرع وأكثر تفاعلية...'
            ],
            'الذكاء الاصطناعي' => [
                'titles' => ['كيف يغير ChatGPT مستقبل البرمجة؟', 'أساسيات تعلم الآلة للمبتدئين', 'تطبيقات الذكاء الاصطناعي في الطب', 'مخاطر الذكاء الاصطناعي وكيفية تجنبها'],
                'content' => 'الذكاء الاصطناعي ليس مجرد خيال علمي، بل هو واقع نعيشه اليوم يغير طريقة عملنا وتفكيرنا...'
            ],
            'الأمن السيبراني' => [
                'titles' => ['كيف تحمي موقعك من هجمات SQL Injection؟', 'أهمية التشفير في حماية البيانات', 'دليلك الشامل للأمن السيبراني في 2024', 'أشهر الاختراقات الأمنية في العقد الأخير'],
                'content' => 'حماية البيانات هي الأولوية القصوى في عصرنا الرقمي، الثغرات الأمنية قد تكلف الشركات ملايين الدولارات...'
            ],
            'تطوير تطبيقات الجوال' => [
                'titles' => ['مقارنة بين Flutter و React Native', 'كيفية نشر تطبيقك على App Store', 'أحدث ميزات Android 15 للمطورين', 'بناء تطبيقات سريعة باستخدام Swift'],
                'content' => 'تطبيقات الجوال أصبحت جزءاً لا يتجزأ من حياتنا اليومية، اختيار التقنية المناسبة يحدد نجاح تطبيقك...'
            ],
            'الحوسبة السحابية' => [
                'titles' => ['شرح خدمات AWS للمبتدئين', 'لماذا تهاجر الشركات إلى Google Cloud؟', 'مستقبل الحوسبة السحابية والـ Serverless', 'أمن البيانات في السحابة'],
                'content' => 'الحوسبة السحابية توفر مرونة هائلة للشركات لنمو بنيتها التحتية دون تكاليف باهظة...'
            ],
            'علم البيانات' => [
                'titles' => ['كيف تصبح عالم بيانات ناجح؟', 'أهمية تحليل البيانات في اتخاذ القرار', 'شرح مكتبة Pandas لتحليل البيانات', 'تصور البيانات باستخدام Python'],
                'content' => 'البيانات هي النفط الجديد، القدرة على استخراج المعلومات من البيانات الخام هي مهارة المستقبل...'
            ],
            'ديف أوبس (DevOps)' => [
                'titles' => ['أساسيات Docker للمطورين', 'كيفية بناء خطوط CI/CD ناجحة', 'شرح نظام Kubernetes ببساطة', 'أتمتة البنية التحتية باستخدام Terraform'],
                'content' => 'ثقافة الديف أوبس تهدف لتقليل الفجوة بين المطورين وفريق العمليات لضمان سرعة وجودة النشر...'
            ],
            'بلوكشين' => [
                'titles' => ['ما هو البلوكشين بعيداً عن العملات الرقمية؟', 'كيفية بناء العقود الذكية', 'مستقبل الويب 3.0', 'تطبيقات البلوكشين في سلاسل الإمداد'],
                'content' => 'تقنية البلوكشين توفر شفافية وأماناً غير مسبوق في المعاملات الرقمية...'
            ],
            'إنترنت الأشياء (IoT)' => [
                'titles' => ['كيف تعمل المنازل الذكية؟', 'مستقبل إنترنت الأشياء في الصناعة', 'تطوير مشاريع باستخدام Raspberry Pi', 'أمن أجهزة إنترنت الأشياء'],
                'content' => 'ربط الأشياء بالإنترنت يفتح آفاقاً جديدة للتحكم والأتمتة في كل مجالات الحياة...'
            ],
        ];

        foreach ($categoriesData as $catName => $data) {
            $category = Category::create([
                'name' => $catName,
                'slug' => Str::slug($catName, '-', 'ar'),
            ]);

            $this->command->comment("Creating 50 articles for: {$catName}...");

            for ($i = 0; $i < 50; $i++) {
                // Pick a random title from the list or generate one
                $title = $data['titles'][array_rand($data['titles'])] . " (" . ($i + 1) . ")";

                Article::create([
                    'category_id' => $category->id,
                    'user_id' => $users->random()->id,
                    'title' => $title,
                    'content' => $data['content'] . "\n\n" . "هذا نص إضافي للمقال رقم " . ($i + 1) . " يتحدث عن تفاصيل " . $catName . " وكيفية الاستفادة منها في المشاريع البرمجية الحديثة.",
                    'image' => 'https://picsum.photos/seed/' . Str::random(10) . '/800/600',
                ]);
            }
        }

        $this->command->info('Database seeding completed successfully with Arabic content!');
    }
}
