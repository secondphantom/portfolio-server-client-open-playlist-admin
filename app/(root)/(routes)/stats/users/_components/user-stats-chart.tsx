"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponseUserStatGetListByQuery } from "@/server/spec/stat/user/user.stat.responses";

type Props = {
  userStatListData: ResponseUserStatGetListByQuery;
};

const UserStatsChart: React.FC<Props> = ({
  userStatListData: { userStats, period },
}) => {
  const [actives, setActives] = useState(["total", "mau", "wau", "dau"]);

  const data = userStats
    .map(({ eventAt, data }) => {
      return {
        name: new Date(eventAt).toLocaleDateString(),
        ...data,
      };
    })
    .reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Stats</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center flex-col items-center space-y-2">
        <ToggleGroup
          variant="outline"
          type="multiple"
          onValueChange={(value) => {
            setActives(value);
          }}
          defaultValue={actives}
        >
          <ToggleGroupItem value="total">Total</ToggleGroupItem>
          <ToggleGroupItem value="mau">MAU</ToggleGroupItem>
          <ToggleGroupItem value="wau">WAU</ToggleGroupItem>
          <ToggleGroupItem value="dau">DAU</ToggleGroupItem>
        </ToggleGroup>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {actives.includes("total") && (
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          )}
          {actives.includes("mau") && (
            <Line type="monotone" dataKey="mau" stroke="#82ca9d" />
          )}
          {actives.includes("wau") && (
            <Line type="monotone" dataKey="wau" stroke="#42f5dd" />
          )}
          {actives.includes("dau") && (
            <Line type="monotone" dataKey="dau" stroke="#f542f5" />
          )}
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default UserStatsChart;
