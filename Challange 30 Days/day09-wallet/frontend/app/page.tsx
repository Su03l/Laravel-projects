'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Stats, Transaction, TransactionFormData } from '@/types';
import {
  getStats,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/api';
import { StatsCards, TransactionTable, TransactionModal } from '@/components';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, transactionsData] = await Promise.all([
        getStats(),
        getTransactions(),
      ]);
      setStats(statsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المعاملة؟')) return;

    try {
      await deleteTransaction(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleSubmitTransaction = async (data: TransactionFormData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data);
    }
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">المحفظة الذكية</h1>
            <p className="text-gray-500 mt-1">تتبع دخلك ومصاريفك بسهولة</p>
          </div>
          <button
            onClick={handleAddTransaction}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة معاملة</span>
          </button>
        </div>

        <StatsCards stats={stats} loading={loading} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4">المعاملات الأخيرة</h2>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitTransaction}
          initialData={editingTransaction}
        />
      </div>
    </div>
  );
}
