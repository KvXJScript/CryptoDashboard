import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1D");

  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "1Y", value: "1Y" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Portfolio Performance</h2>
          <div className="flex items-center space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                size="sm"
                variant={activeTimeframe === timeframe.value ? "default" : "outline"}
                className={`px-3 py-1 text-xs rounded-full ${
                  activeTimeframe === timeframe.value
                    ? "bg-crypto-primary text-white"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTimeframe(timeframe.value)}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Placeholder with Gradient */}
        <div className="h-64 bg-gradient-to-r from-crypto-primary/20 to-crypto-success/20 rounded-xl flex items-end justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
            {/* Simulated chart bars */}
            {[60, 45, 70, 55, 80, 75, 90, 85, 95, 100].map((height, index) => (
              <div
                key={index}
                className="w-2 bg-crypto-success/60 rounded-t transition-all duration-300 hover:bg-crypto-success/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="text-center z-10 mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive chart will display real portfolio performance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
