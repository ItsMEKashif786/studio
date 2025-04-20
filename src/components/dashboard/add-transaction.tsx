'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/hooks/use-toast';

interface AddTransactionProps {
  transactions: any[];
  updateTransactions: (transactions: any[]) => void;
}

// Category options
const categories = [
  "Food",
  "Books",
  "Transport",
  "Entertainment",
  "Other",
]

const AddTransaction: React.FC<AddTransactionProps> = ({transactions, updateTransactions}) => {
  const [newTransaction, setNewTransaction] = useState({
    type: 'spend',
    amount: 0,
    category: 'Food',
    notes: '',
  });

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

    const transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount.toString()),
      category: newTransaction.category,
      notes: newTransaction.notes,
      date: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, transaction];
    updateTransactions(updatedTransactions);
    setNewTransaction({type: 'spend', amount: 0, category: 'Food', notes: ''});

    toast({
      title: "Success",
      description: "Transaction added successfully",
    })
  };

  return (
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
  );
};

export default AddTransaction;
