'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';
import {Icons} from '@/components/icons';

type UserData = {
  name: string;
  monthlyBudget: number;
  school: string;
  upiId?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [school, setSchool] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setName(parsedUserData.name);
      setMonthlyBudget(parsedUserData.monthlyBudget);
      setSchool(parsedUserData.school);
      setUpiId(parsedUserData.upiId || '');
    } else {
      router.push('/onboarding');
    }
  }, [router]);

  const handleSubmit = () => {
    if (!name || !monthlyBudget || !school) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedUserData: UserData = {
      name: name,
      monthlyBudget: parseFloat(monthlyBudget.toString()),
      school: school,
      upiId: upiId,
    };

    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    toast({
      title: "Success",
      description: "User data updated successfully.",
    });
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster/>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyBudget">Monthly Budget</Label>
              <Input
                type="number"
                id="monthlyBudget"
                placeholder="Enter your monthly budget"
                value={monthlyBudget.toString()}
                onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="school">School/College Name</Label>
              <Input
                type="text"
                id="school"
                placeholder="Enter your school/college name"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                type="text"
                id="upiId"
                placeholder="Enter your UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit}>Update Profile</Button>
          </div>
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
         <Button variant="ghost" onClick={() => router.push('/transactions')}>
          <Icons.share className="mr-2"/>
          Udhar
        </Button>
      </div>
    </div>
  );
}
