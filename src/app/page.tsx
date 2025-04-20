
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

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

// Category options
const categories = [
  "Food",
  "Books",
  "Transport",
  "Entertainment",
  "Other",
]

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [newTransaction, setNewTransaction] = useState({
    type: 'spend',
    amount: 0,
    category: 'Food',
    notes: '',
  });
  const [isResetting, setIsResetting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load user data and transactions from local storage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      // If no user data, redirect to onboarding
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

  // Function to add a new transaction
  const addTransaction = () => {
    if (!newTransaction.amount) {
      toast({
        title: "Error",
        description: "Amount cannot be empty",
        variant: "destructive",
      })
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount.toString()),
      category: newTransaction.category,
      notes: newTransaction.notes,
      date: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setNewTransaction({ type: 'spend', amount: 0, category: 'Food', notes: '' });

    toast({
      title: "Success",
      description: "Transaction added successfully",
    })
  };

  // Function to delete a transaction
  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    })
  };

  // Function to reset all data
  const resetAllData = () => {
    setIsResetting(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('transactions');
    setUserData(null);
    setTransactions([]);
    setCurrentBalance(0);
    setTotalSpend(0);
    setTotalCredit(0);
    setIsResetting(false);
    router.push('/onboarding');

    toast({
      title: "Success",
      description: "All data reset successfully",
    })
  };

  const cancelReset = () => {
    setIsResetting(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!userData) {
    return null; // Loading state or handle no user data
  }

  const budgetPercentage = (currentBalance / userData.monthlyBudget) * 100;

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Welcome, {userData.name}!
        </h1>
        <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            ${currentBalance.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            ${totalSpend.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Credit</CardTitle>
          </CardHeader>
          <CardContent>
            ${totalCredit.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Budget Status */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={budgetPercentage} />
          <p className="text-sm mt-2">
            {budgetPercentage.toFixed(2)}% of your budget remaining
          </p>
        </CardContent>
      </Card>

      {/* Add Transaction Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as 'spend' | 'credit' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spend">Spend</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                id="amount"
                value={newTransaction.amount.toString()}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Transaction notes"
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={addTransaction}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="destructive" size="sm" onClick={() => deleteTransaction(transaction.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Data Confirmation */}
      <AlertDialog open={isResetting} onOpenChange={setIsResetting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset all your data and you will be redirected to the onboarding page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelReset}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
