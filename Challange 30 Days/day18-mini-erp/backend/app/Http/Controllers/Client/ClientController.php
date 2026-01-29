<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Models\Client;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Client::query();

        // بحث بسيط بالاسم أو الايميل
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('company_name', 'like', "%{$search}%")
                ->orWhere('contact_person', 'like', "%{$search}%");
        }

        $clients = $query->latest()->paginate(10);

        return $this->success($clients);
    }

    // إضافة عميل جديد
    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return $this->success($client, 'تم إضافة العميل بنجاح', 201);
    }

    // عرض تفاصيل عميل
    public function show(Client $client)
    {
        // مستقبلاً بنضيف: ->load('projects', 'invoices')
        return $this->success($client);
    }

    // تعديل بيانات العميل
    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'company_name' => 'sometimes|string',
            'contact_person' => 'sometimes|string',
            'email' => 'sometimes|email|unique:clients,email,' . $client->id,
            'phone' => 'sometimes|string',
            'status' => 'in:active,inactive'
        ]);

        $client->update($data);

        return $this->success($client, 'تم تحديث بيانات العميل');
    }

    // حذف العميل (بشرط عدم وجود ارتباطات)
    public function destroy(Client $client)
    {


        $client->delete();

        return $this->success(null, 'تم حذف العميل بنجاح');
    }
}
