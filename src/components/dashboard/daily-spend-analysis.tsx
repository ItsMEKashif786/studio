'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface DailySpendAnalysisProps {
  transactions: any[];
}

const DailySpendAnalysis: React.FC<DailySpendAnalysisProps> = ({transactions}) => {
  const [dailySpend, setDailySpend] = useState(0);

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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Daily Spend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Today's Spend: ${dailySpend.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default DailySpendAnalysis;
