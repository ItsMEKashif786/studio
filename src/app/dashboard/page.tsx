'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Toaster} from '@/components/ui/toaster';
import {Switch} from '@/components/ui/switch';
import BudgetStatus from '@/components/dashboard/budget-status';
import DailySpendAnalysis from '@/components/dashboard/daily-spend-analysis';
import CategorySpend from '@/components/dashboard/category-spend';
import AddTransaction from '@/components/dashboard/add-transaction';
import TransactionHistory from '@/components/dashboard/transaction-history';
import {Icons} from '@/components/icons';
import {cn} from '@/lib/utils';

// Define types for user data and transactions
type UserData = {
  name: string;
  monthlyBudget: number;
  school: string;
};

type Transaction = {
  id: string;
  type: 'spend' | 'credit';
  amount: number;
  category: string;
  notes?: string;
  date: string;
};

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Load user data and transactions from local storage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      router.push('/onboarding');
      return;
    }

    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, [router]);

  // Calculate current balance, total spend, and total credit whenever transactions change
  useEffect(() => {
    if (userData) {
      const calculatedTotalSpend = transactions.reduce((sum, transaction) => {
        return transaction.type === 'spend' ? sum + transaction.amount : sum;
      }, 0);

      const calculatedTotalCredit = transactions.reduce((sum, transaction) => {
        return transaction.type === 'credit' ? sum + transaction.amount : sum;
      }, 0);

      setTotalSpend(calculatedTotalSpend);
      setTotalCredit(calculatedTotalCredit);
      setCurrentBalance(userData.monthlyBudget + calculatedTotalCredit - calculatedTotalSpend);
    }
  }, [transactions, userData]);

  // Function to update transactions
  const updateTransactions = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!userData) {
    return null; // Loading state or handle no user data
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster/>
      <div className="flex items-center justify-between mb-4">
        <h1 className={cn("text-2xl font-semibold transition-colors", isDarkMode ? "text-white" : "text-gray-800")}>
          Dashboard
        </h1>
        <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode}/>
      </div>
      {/* Display Student's Name */}
      {userData && (
        <div className={cn("mb-4 text-xl font-semibold transition-colors", isDarkMode ? "text-gray-300" : "text-gray-700")}>
          Welcome, {userData.name}!
        </div>
      )}

      <BudgetStatus currentBalance={currentBalance} monthlyBudget={userData.monthlyBudget} totalSpend={totalSpend} totalCredit={totalCredit}/>
      <DailySpendAnalysis transactions={transactions}/>
      <CategorySpend transactions={transactions}/>
      <AddTransaction transactions={transactions} updateTransactions={updateTransactions}/>
      <TransactionHistory transactions={transactions} updateTransactions={updateTransactions}/>
       <Button variant="secondary" onClick={() => router.push('/transactions')}>
          Transactions
        </Button>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          <Icons.home className="mr-2"/>
          Dashboard
        </Button>
        <Button variant="ghost" onClick={() => router.push('/profile')}>
          <Icons.user className="mr-2"/>
          Profile
        </Button>
      </div>
    </div>
  );
}
