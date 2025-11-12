import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart, registerables, defaults } from 'chart.js';
Chart.register(...registerables);
defaults.maintainAspectRatio = false;

const BarChart = (props) => {
    let labels, datasets,legend;
    if (props.double) {
        labels = props.labels;
        datasets = [
            { label: props.reqLabel, data: props.reqValues, backgroundColor: '#3B82F6', },
            { label: props.donLabel, data: props.donValues, backgroundColor: '#EF4444', }
        ]
        legend = {
                position: 'bottom'
            }
    }
    else {
        labels = props.resultLabel;
        datasets = [
            { data: props.resultValue, backgroundColor: ['#3B82F6','#EF4444','rgb(0,255,255)','#AAAAAA'] }
        ]
        legend=false
        
        
    }

    const chartData = {
        labels: labels,
        datasets: datasets
    }
    const options = {
        responsive: true,
        plugins: {
            legend: legend
        },
        scales: {
            y: {
                min: 0,
                max: props.double ? undefined : 1  
            }
        }


    }

    return (
        <><Bar data={chartData} options={options} /></>
    )
}

export default BarChart;
