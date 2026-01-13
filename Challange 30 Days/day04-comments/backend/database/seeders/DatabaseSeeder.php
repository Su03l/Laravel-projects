<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Video;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $post1 = Post::create([
            'title' => 'شرح العلاقات في لارفل',
            'content' => 'العلاقات متعددة الأشكال (Polymorphic) توفر الكثير من الجهد والوقت...'
        ]);

        $post2 = Post::create([
            'title' => 'أهم مميزات PHP 8.2',
            'content' => 'تمت إضافة ميزة Readonly Classes وغيرها من التحسينات...'
        ]);

        $video1 = Video::create([
            'title' => 'دورة لارفل للمبتدئين - الحلقة 1',
            'url' => 'https://youtube.com/watch?v=xyz123'
        ]);

        $video2 = Video::create([
            'title' => 'مقارنة بين React و Vue',
            'url' => 'https://youtube.com/watch?v=abc987'
        ]);

        $post1->comments()->create(['body' => 'شرح ممتاز جداً، شكراً لك!']);
        $post1->comments()->create(['body' => 'هل يمكن شرح Many-to-Many أيضاً؟']);

        $video2->comments()->create(['body' => 'الصوت يحتاج تحسين قليلاً.']);
        $video2->comments()->create(['body' => 'React هو الأفضل بلا منازع ']);

        $post2->comments()->create(['body' => 'PHP لا تموت أبداً!']);
    }
}
