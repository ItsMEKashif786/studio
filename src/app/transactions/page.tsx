'use client';

import {useEffect, useState, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';
import {Progress} from '@/components/ui/progress';
import {Icons} from '@/components/icons';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import React from 'react';
import {cn} from '@/lib/utils';

type PersonTransaction = {
  id: string;
  personName: string;
  type: 'gave' | 'received';
  amount: number;
  notes?: string;
  upiId?: string;
};

type UserData = {
  name: string;
  monthlyBudget: number;
  school: string;
  upiId?: string;
};

const PERSON_TRANSACTIONS_STORAGE_KEY = 'personTransactions';

export default function TransactionsPage() {
  const [personTransactions, setPersonTransactions] = useState<PersonTransaction[]>([]);
  const [name, setName] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personName, setPersonName] = useState('');
  const [type, setType: React.Dispatch<React.SetStateAction<'gave' | 'received'>>] = useState<'gave' | 'received'>('gave');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [totalGave, setTotalGave] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gave' | 'received'>('all');
  const router = useRouter();

  useEffect(() => {
    const storedTransactions = localStorage.getItem(PERSON_TRANSACTIONS_STORAGE_KEY);
    if (storedTransactions) {
      setPersonTransactions(JSON.parse(storedTransactions));
    }

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setName(parsedUserData.name);
      setUpiId(parsedUserData.upiId || '');
    }
  }, []);

  useEffect(() => {
    const gave = personTransactions.reduce((sum, transaction) => {
      return transaction.type === 'gave' ? sum + transaction.amount : sum;
    }, 0);

    const received = personTransactions.reduce((sum, transaction) => {
      return transaction.type === 'received' ? sum + transaction.amount : sum;
    }, 0);

    setTotalGave(gave);
    setTotalReceived(received);
  }, [personTransactions]);

  const addTransaction = () => {
    if (!personName || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: PersonTransaction = {
      id: Date.now().toString(),
      personName: personName,
      type: type,
      amount: parseFloat(amount.toString()),
      notes: notes,
      upiId: upiId,
    };

    const updatedTransactions = [...personTransactions, newTransaction];
    setPersonTransactions(updatedTransactions);
    localStorage.setItem(PERSON_TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    setPersonName('');
    setType('gave');
    setAmount(0);
    setNotes('');

    toast({
      title: "Success",
      description: "Transaction added successfully.",
    });
  };

  const calculateBalance = () => {
    return totalReceived - totalGave;
  };

  const generateUpiLink = useCallback((transaction: PersonTransaction) => {
    if (!userData?.upiId) {
      toast({
        title: "Error",
        description: "Please add your UPI ID in profile page first.",
        variant: "destructive",
      });
      router.push('/profile');
      return null;
    }
    const upiLink = `upi://pay?pa=${userData?.upiId}&am=${transaction.amount}&tn=${transaction.notes}`;
    return upiLink;
  }, [userData?.upiId, router]);

  const handlePayWithUpi = (transaction: PersonTransaction) => {
    const upiLink = generateUpiLink(transaction);
    if (upiLink) {
      window.open(upiLink, '_blank');
    }
  };

  const progress = (totalGave / totalReceived) * 100;
  const transactionBalance = calculateBalance();

  const filteredTransactions = filterType === 'all'
    ? personTransactions
    : personTransactions.filter(transaction => transaction.type === filterType);

  return (
    <div className="container mx-auto p-4">
      <Toaster/>
      <Card>
        <CardHeader>
          <CardTitle>Person-to-Person Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="personName">Person Name</Label>
              <Input
                type="text"
                id="personName"
                placeholder="Enter person name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onValueChange={(value) => setType(value as 'gave' | 'received'))}
              >
                <SelectTrigger>
                  <SelectValue>{type === 'gave' ? 'Gave' : 'Received'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gave">Gave</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount.toString()}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={addTransaction}>Add Transaction</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              Total Amount You Gave: ₹{totalGave.toFixed(2)}
            </div>
            <div>
              Total Amount You Received: ₹{totalReceived.toFixed(2)}
            </div>
            <div>
              Balance: ₹{transactionBalance.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {totalReceived > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress}/>
            <div>
              {progress.toFixed(2)}% of amount due has been received.
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={value => setFilterType(value as 'all' | 'gave' | 'received')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gave">Gave</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
          {filteredTransactions.length === 0 ? (
            <div>No transactions to display</div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id}>
                <div>
                  Person Name: {transaction.personName}
                </div>
                <div>
                  Type: {transaction.type}
                </div>
                <div>
                  Amount: ₹{transaction.amount}
                </div>
                <div>
                  Notes: {transaction.notes}
                </div>
                {transaction.type === 'gave' && (
                  <Button variant="secondary" onClick={() => handlePayWithUpi(transaction)}>Pay with UPI</Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
       {/* Bottom navigation bar */}
       <div className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border p-4 flex justify-around z-50">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          <Icons.home className="mr-2"/>
          Dashboard
        </Button>
        <Button variant="ghost" onClick={() => router.push('/profile')}>
          <Icons.user className="mr-2"/>
          Profile
        </Button>
         <Button variant="ghost" onClick={() => router.push('/transactions')}>
          <Icons.share className="mr-2"/>
          Udhar
        </Button>
      </div>
    </div>
  );
}

