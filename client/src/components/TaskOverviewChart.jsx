import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function TaskOverviewChart({ taskStats }) {
  const data = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          taskStats.pendingTasks,
          taskStats.inProgressTasks,
          taskStats.completedTasks,
        ],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default TaskOverviewChart;
