'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {Button} from '@/components/ui/button';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Icons} from '@/components/icons';
import {toast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {PieChart, Pie, Cell, ResponsiveContainer, Sector} from 'recharts';

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

// Define color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function DashboardPage() {
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
  const [dailySpend, setDailySpend] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Load user data and transactions from local storage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      return;
    }

    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

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

  // Calculate daily spend
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todaySpend = transactions.reduce((sum, transaction) => {
      if (transaction.type === 'spend' && transaction.date.slice(0, 10) === today) {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
    setDailySpend(todaySpend);
  }, [transactions]);

  // Prepare data for category spend pie chart
  useEffect(() => {
    const categorySpend: { [key: string]: number } = {};
    transactions.forEach(transaction => {
      if (transaction.type === 'spend') {
        categorySpend[transaction.category] = (categorySpend[transaction.category] || 0) + transaction.amount;
      }
    });

    const categoryData = Object.entries(categorySpend).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
    setCategoryData(categoryData);
  }, [transactions]);

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
      <Toaster/>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>
        <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode}/>
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
          <Progress value={budgetPercentage}/>
          <p className="text-sm mt-2">
            {budgetPercentage.toFixed(2)}% of your budget remaining
          </p>
        </CardContent>
      </Card>

      {/* Daily Spend Analysis */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Daily Spend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Today's Spend: ${dailySpend.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Category Spend Pie Chart */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Category Spend</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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
                onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'spend' | 'credit'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type"/>
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
                onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category"/>
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
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={addTransaction}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      {/* Reset Data Confirmation */}
      <AlertDialog open={isResetting} onOpenChange={setIsResetting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset all your data.
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
