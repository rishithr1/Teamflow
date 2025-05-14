import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartsProps {
  workloadData?: number[];
  taskDistributionData?: Array<{ value: number, name: string }>;
  performanceData?: Array<{ name: string, data: number[] }>;
}

const Charts: React.FC<ChartsProps> = ({ 
  workloadData = [120, 200, 150, 80, 70],
  taskDistributionData = [
    { value: 35, name: "High Priority" },
    { value: 45, name: "Medium Priority" },
    { value: 20, name: "Low Priority" },
  ],
  performanceData = [
    {
      name: "Team A",
      data: [90, 85, 95, 92],
    },
    {
      name: "Team B",
      data: [70, 82, 91, 84],
    },
  ]
}) => {
  const workloadChartRef = useRef<HTMLDivElement>(null);
  const taskDistributionRef = useRef<HTMLDivElement>(null);
  const performanceChartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize charts when component mounts
    const charts: echarts.ECharts[] = [];
    
    if (workloadChartRef.current) {
      const chart = echarts.init(workloadChartRef.current);
      const option = {
        animation: false,
        title: { text: "Team Workload Distribution", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        yAxis: { type: "value" },
        series: [
          {
            data: workloadData,
            type: "line",
            smooth: true,
          },
        ],
      };
      chart.setOption(option);
      charts.push(chart);
    }
    
    if (taskDistributionRef.current) {
      const chart = echarts.init(taskDistributionRef.current);
      const option = {
        animation: false,
        title: { text: "Task Distribution", left: "center" },
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: taskDistributionData,
          },
        ],
      };
      chart.setOption(option);
      charts.push(chart);
    }
    
    if (performanceChartRef.current) {
      const chart = echarts.init(performanceChartRef.current);
      const option = {
        animation: false,
        title: { text: "Performance Metrics", left: "center" },
        xAxis: { type: "category", data: ["Q1", "Q2", "Q3", "Q4"] },
        yAxis: { type: "value" },
        series: performanceData.map(team => ({
          name: team.name,
          data: team.data,
          type: "bar",
          barWidth: "20%",
          itemStyle: {
            color: team.name === "Team A" ? "#4299e1" : "#48bb78",
          },
        })),
        legend: {
          data: performanceData.map(team => team.name),
          bottom: 0,
        },
      };
      chart.setOption(option);
      charts.push(chart);
    }
    
    // Handle resize
    const handleResize = () => {
      charts.forEach(chart => chart.resize());
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      charts.forEach(chart => chart.dispose());
      window.removeEventListener('resize', handleResize);
    };
  }, [workloadData, taskDistributionData, performanceData]);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div ref={workloadChartRef} style={{ height: "300px" }}></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div ref={taskDistributionRef} style={{ height: "300px" }}></div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div ref={performanceChartRef} style={{ height: "300px" }}></div>
      </div>
    </>
  );
};

export default Charts;