"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import * as _ from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

async function getDataProduct() {
  const response = await fetch("https://dummyjson.com/products?limit=100000");
  const resJson = await response.json();

  const data = resJson.products;
  return data;
}

function Home() {
  const [labels, setLabels] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Products & Carts Chart",
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const resData = await getDataProduct();
      const arrLabel: any = _.map(resData, (el) => el.title);
      const arrDatas: any = _.map(resData, (el) => el.stock);
      setLabels(arrLabel);
      setDataProduct(arrDatas);
    };
    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Products",
        data: dataProduct,
        backgroundColor: "rgba(67, 56, 202, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="font-semibold text-xl px-4 text-white bg-indigo-700 py-2 rounded-md shadow-md mb-4">
        Dashboard
      </h2>

      <Bar options={options} data={data} />
    </div>
  );
}
export default Home;
