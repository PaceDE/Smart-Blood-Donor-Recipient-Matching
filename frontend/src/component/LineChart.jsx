import React from 'react'
import { Line } from 'react-chartjs-2';
import { Chart, registerables, defaults } from 'chart.js';
import Color from 'color'
Chart.register(...registerables);
defaults.maintainAspectRatio = true;

const LineChart = (props) => {
    const labels= props.FPR.map(v=>v)
    const data = props.TPR.map(v=>v)

    const rocData = props.FPR.map((v, i) => ({
        x: v,
        y: props.TPR[i]
    }))
  
const chartData = {
  datasets: [
    {
      label: `ROC Curve AUC=(${props.AUC.toFixed(2)})`,
      data: rocData,
      borderColor: 'rgb(255, 5, 5)',
      backgroundColor: 'rgba(255, 0, 0, 0.5)',

    },
    {
      label: 'Random Classifier',
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      borderColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgba(5, 5, 5, 0.5)',
      
      borderDash: [5, 5]
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { type: 'linear', title: { display: true, text: 'False Positive Rate' } },
    y: { title: { display: true, text: 'True Positive Rate' } }
  }
};

    return (
        <>
            <Line data={chartData} options={options} />
        </>
    );
}


export default LineChart