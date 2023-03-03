import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options: any = {
  responsive: true,
  animation: {
    duration: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    title: {
      display: true,
      text: "",
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
        type: "logarithmic",
        position: "right",
      },
    },
  },
};

const CrashGraph = (props: { data: number[] }) => {
  const labels = props.data.map((val) => val.toString());
  console.log(props.data);

  options.plugins.title.text = `x${props.data[props.data.length - 1]}`;

  const data = {
    labels,
    datasets: [
      {
        data: props.data.map((val) => val ** 10),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default CrashGraph;
