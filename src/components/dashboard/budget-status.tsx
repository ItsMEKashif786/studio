'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';

interface BudgetStatusProps {
  currentBalance: number;
  monthlyBudget: number;
  totalSpend: number;
  totalCredit: number;
}

const BudgetStatus: React.FC<BudgetStatusProps> = ({currentBalance, monthlyBudget, totalSpend, totalCredit}) => {
  const budgetPercentage = (currentBalance / monthlyBudget) * 100;

  return (
    <>
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            ₹{currentBalance.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            ₹{totalSpend.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Credit</CardTitle>
          </CardHeader>
          <CardContent>
            ₹{totalCredit.toFixed(2)}
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
    </>
  );
};

export default BudgetStatus;
