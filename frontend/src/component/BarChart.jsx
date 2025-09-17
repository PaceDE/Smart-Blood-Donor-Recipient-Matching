import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart, registerables, defaults } from 'chart.js';
Chart.register(...registerables);
defaults.maintainAspectRatio = false;

const BarChart = ({ labels, reqValues, donValues, reqLabel, donLabel }) => {

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: reqLabel,
                data: reqValues,
                backgroundColor: '#3B82F6',

            },
            {
                label: donLabel,
                data: donValues,
                backgroundColor: '#EF4444',
            }
        ]

    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        
    }

    return (
        <><Bar data={chartData} options={options} /></>
    )
}

export default BarChart;
