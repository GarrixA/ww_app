"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartComponent = ({ budgetInfo }: any) => {
  return (
    <div className="border rounded-lg p-5">
      <h1>Activity </h1>
      <ResponsiveContainer width={"40%"} height={300}>
        <BarChart
          data={budgetInfo}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis dataKey={"name"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={"total_spent"} stackId={"a"} fill="#1E90FF" />
          <Bar dataKey={"amount"} stackId={"a"} fill="#ADD8E6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
