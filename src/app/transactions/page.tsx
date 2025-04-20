'use client';

import {useEffect, useState} from 'react';
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
import {cn} from '@/lib/utils';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

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

export default function TransactionsPage() {
  const [personTransactions, setPersonTransactions] = useState<PersonTransaction[]>([]);
  const [name, setName] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personName, setPersonName] = useState('');
  const [type, setType] = useState<'gave' | 'received'>('gave');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [totalGave, setTotalGave] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [upiId, setUpiId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedTransactions = localStorage.getItem('personTransactions');
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
    localStorage.setItem('personTransactions', JSON.stringify(personTransactions));
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

    setPersonTransactions([...personTransactions, newTransaction]);
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

  const generateUpiLink = (transaction: PersonTransaction) => {
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
  };

  const handlePayWithUpi = (transaction: PersonTransaction) => {
    const upiLink = generateUpiLink(transaction);
    if (upiLink) {
      window.open(upiLink, '_blank');
    }
  };

  const progress = (totalGave / totalReceived) * 100;
  const transactionBalance = calculateBalance();

  return (
    <div className="container mx-auto p-4">
      <Toaster/>
      <Card>
        <CardHeader>
          <CardTitle>Person-to-Person Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="mb-4">
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
                onValueChange={(value) => setType(value as 'gave' | 'received')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gave">Gave</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount.toString()}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
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

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            Total Amount You Gave: ₹{totalGave.toFixed(2)}
          </div>
          <div className="mb-2">
            Total Amount You Received: ₹{totalReceived.toFixed(2)}
          </div>
          <div>
            Balance: ₹{transactionBalance.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {totalReceived > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress}/>
            <p className="text-sm mt-2">
              {progress.toFixed(2)}% of amount due has been received.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {personTransactions.map((transaction) => (
            <div key={transaction.id} className="mb-2 p-2 border rounded-md">
              <div>Person Name: {transaction.personName}</div>
              <div>Type: {transaction.type}</div>
              <div>Amount: ₹{transaction.amount}</div>
              <div>Notes: {transaction.notes}</div>
              {transaction.type === 'gave' && (
                <Button onClick={() => handlePayWithUpi(transaction)}>
                  Pay with UPI
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

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
