'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';

interface CategorySpendProps {
  transactions: any[];
}

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

const CategorySpend: React.FC<CategorySpendProps> = ({transactions}) => {
  const [categoryData, setCategoryData] = useState<any[]>([]);

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

  return (
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
  );
};

export default CategorySpend;
