import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart ,registerables,defaults } from 'chart.js';
import Color from 'color'
Chart.register(...registerables);
defaults.maintainAspectRatio = true;

const DoughnutChart = ({labels,label,values,colors}) => {
const total = values.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels: labels.map((label, idx) => {
      const percent = ((values[idx] / total) * 100).toFixed(1);
      return `${label} (${percent}%)`;
    }),
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(c => Color(c).darken(0.2).hex()),
        borderColor: '#fff',
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      maintainAspectRatio:false,
      responsive:true,
    },
  };
    return (
        <>
             <Doughnut data={chartData} options={options} />
        </>
    );
}
export default DoughnutChart;