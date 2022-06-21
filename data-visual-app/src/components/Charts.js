import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const Charts = ({ data }) => {
  if (!data) return;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Estimaated Diameter',
          font: {
            size: 15,
          },
        },
        ticks: {
          precision: 0,
        },
      },
      xAxes: {
        title: {
          display: true,
          text: 'Miss Distance',
          font: {
            size: 15,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Asteriod Diameter Vs Miss Distance',
      },
    },
  };

  //sorted last 7 dates
  let datesArr = Object.keys(data.near_earth_objects).sort();

  // calculate miss distance and average eastimated diameter per day
  let ratioByDay = datesArr.map((key) => {
    return data.near_earth_objects[key].map((obj) => {
      let { close_approach_data, estimated_diameter } = obj;

      //NOTE: the measuring unit used in both of their calculations is in Kms

      let miss_distance = close_approach_data[0].miss_distance.kilometers;

      //calculate avg estimated diameter using (min + max) / 2
      let avg_estimated_diameter =
        (estimated_diameter.kilometers.estimated_diameter_max +
          estimated_diameter.kilometers.estimated_diameter_min) /
        2;

      return {
        x: miss_distance,
        y: avg_estimated_diameter,
      };
    });
  });

  //initialize empt chart data
  const chartData = {
    datasets: [],
  };

  for (let index = 0; index < ratioByDay.length; index++) {
    const date = datesArr[index];
    chartData.datasets.push({
      label: date,
      data: ratioByDay[index],
      backgroundColor:
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .toString(), //colors array for scatter chart -> each day having different color
      pointRadius: 4,
      pointHoverRadius: 6,
    });
  }

  return <Scatter options={options} data={chartData} />;
};

export default Charts;
