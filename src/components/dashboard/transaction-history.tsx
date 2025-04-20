'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {toast} from '@/hooks/use-toast';

interface TransactionHistoryProps {
  transactions: any[];
  updateTransactions: (transactions: any[]) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({transactions, updateTransactions}) => {
  const [isResetting, setIsResetting] = useState(false);

  // Function to delete a transaction
  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    updateTransactions(updatedTransactions);

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
    window.location.reload();
    setIsResetting(false);
  };

  const cancelReset = () => {
    setIsResetting(false);
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    {transaction.type === 'spend' ? '-' : '+'} ₹{transaction.amount.toFixed(2)} ({transaction.category}) - {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => deleteTransaction(transaction.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <AlertDialog open={isResetting} onOpenChange={setIsResetting}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={resetAllData}>Reset All Data</Button>
            </AlertDialogTrigger>
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
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionHistory;
