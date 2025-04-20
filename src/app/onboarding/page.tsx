
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type UserData = {
  name: string;
  monthlyBudget: number;
  school: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [school, setSchool] = useState('');

  const handleSubmit = () => {
    if (!name || !monthlyBudget || !school) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const userData: UserData = {
      name: name,
      monthlyBudget: parseFloat(monthlyBudget.toString()),
      school: school,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    toast({
      title: "Success",
      description: "User data saved successfully.",
    });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Welcome! Let's set up your budget.</CardTitle>
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
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
