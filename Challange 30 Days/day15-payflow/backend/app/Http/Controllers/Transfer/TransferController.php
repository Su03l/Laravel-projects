<?php

namespace App\Http\Controllers\Transfer;

use App\Http\Controllers\Controller;
use App\Models\Beneficiary;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransferController extends Controller
{
    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = Auth::user();

        DB::beginTransaction();
        try {
            // قفل السجل للتحديث
            $user = User::lockForUpdate()->find($user->id);

            // زيادة الرصيد
            $user->increment('wallet_balance', $request->amount);

            // توثيق العملية
            Transaction::create([
                'receiver_id' => $user->id, // المستقبل هو نفسه
                'sender_id' => null, // لأنه إيداع خارجي
                'reference_id' => 'DEP-' . strtoupper(Str::random(10)),
                'amount' => $request->amount,
                'type' => 'deposit',
                'description' => 'ATM Deposit',
                'status' => 'success'
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Deposit successful ',
                'new_balance' => $user->wallet_balance
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Deposit failed'
            ], 500);
        }
    }

    public function transfer(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'beneficiary_id' => 'required|exists:beneficiaries,id',
            'description' => 'nullable|string|max:255'
        ]);

        $user = Auth::user();

        $beneficiaryEntry = Beneficiary::where('id', $request->beneficiary_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $receiverId = $beneficiaryEntry->beneficiary_user_id;

        DB::beginTransaction();

        try {
            // 2. قفل صف المرسل (عشان ما يسوي عمليتين في نفس اللحظة)
            // lockForUpdate: يمنع أي تعديل على هذا الصف حتى تنتهي العملية الحالية
            $sender = User::lockForUpdate()->find($user->id);

            // 3. التحقق من الرصيد (بعد القفل لضمان الدقة)
            if ($sender->wallet_balance < $request->amount) {
                return response()->json([
                    'message' => 'Insufficient balance '
                ], 400);
            }

            // 4. قفل صف المستقبل (عشان نحدث رصيده بأمان)
            $receiver = User::lockForUpdate()->find($receiverId);

            // 5. الخصم والإضافة (Atomic Operation)
            $sender->decrement('wallet_balance', $request->amount);
            $receiver->increment('wallet_balance', $request->amount);

            // 6. تسجيل العملية في السجل (Ledger)
            $transaction = Transaction::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'reference_id' => 'TRX-' . strtoupper(Str::random(10)),
                'amount' => $request->amount,
                'type' => 'transfer',
                'description' => $request->description,
                'status' => 'success'
            ]);

            //  اعتماد التغييرات
            DB::commit();

            return response()->json([
                'message' => 'Transfer successful ',
                'remaining_balance' => $sender->wallet_balance,
                'transaction_ref' => $transaction->reference_id
            ]);
        } catch (\Exception $e) {
            //  في حال حدوث أي خطأ، تراجع فوراً
            DB::rollBack();
            return response()->json([
                'message' => 'Transfer failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // عرض سجل العمليات (كشف الحساب)
    public function history()
    {
        $userId = Auth::id();

        // نجيب العمليات اللي أنا كنت فيها (مرسل) أو (مستقبل)
        $transactions = Transaction::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender:id,name', 'receiver:id,name']) // نجيب الأسماء
            ->latest()
            ->get()
            ->map(function ($t) use ($userId) {
                // تنسيق البيانات لتوضيح هل المبلغ (+ دخل) أو (- خرج)
                $isSender = $t->sender_id == $userId;
                return [
                    'id' => $t->id,
                    'reference' => $t->reference_id,
                    'type' => $t->type,
                    'amount' => $t->amount,
                    'direction' => $isSender ? 'Out' : 'In', // توضيح الاتجاه
                    'other_party' => $isSender
                        ? ($t->receiver->name ?? 'External')
                        : ($t->sender->name ?? ($t->type === 'deposit' ? 'ATM Deposit' : 'External')), // الطرف الآخر
                    'date' => $t->created_at->format('Y-m-d H:i'),
                ];
            });

        return response()->json(['data' => $transactions]);
    }
}
