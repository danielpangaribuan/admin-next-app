"use client";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table";
import * as _ from "lodash";

async function getCartDetail(id: string) {
  const res = await fetch(`https://dummyjson.com/carts/${id}`);
  const resData = await res.json();

  const resUser = await fetch(`https://dummyjson.com/users/${resData.userId}`);
  const dataUser = await resUser.json();

  return { ...resData, name: dataUser.firstName };
}

type ColumnKey = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  totalProducts: number;
  totalQuantity: number;
  total: number;
  title: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
};

export default function CartDetail({ params }: { params: { cartId: string } }) {
  const [data, setData] = useState({
    discountedTotal: 0,
    id: 0,
    products: [],
    total: 0,
    totalProducts: 0,
    totalQuantity: 0,
    name: "",
  });
  const router = useRouter();

  const columns = useMemo<ColumnDef<ColumnKey>[]>(
    () => [
      {
        header: "Product Name",
        accessorKey: "title",
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
      },
      {
        header: "Normal Price",
        accessorKey: "price",
        cell: (cell: any) => {
          const currency = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "USD",
          }).format(cell.getValue());
          return <span>{currency}</span>;
        },
      },
      {
        header: "Total Price",
        accessorKey: "total",
        cell: (cell: any) => {
          return (
            <>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
              }).format(cell.getValue())}
            </>
          );
        },
      },
      {
        header: "Discount Percentage",
        accessorKey: "discountPercentage",
        cell: (cell: any) => {
          return <>{cell.getValue()}%</>;
        },
      },
      {
        header: "Discount Price",
        accessorKey: "discountedPrice",
        cell: (cell: any) => {
          return (
            <>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
              }).format(cell.getValue())}
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await getCartDetail(params.cartId);
      setData(response);
    };
    fetchData();
  }, [params.cartId]);

  return (
    <div className="bg-white p-4 rounded overflow-hidden shadow-lg">
      <div className="flex gap-x-2 mb-4">
        <button
          className="flex justify-center items-center h-12 w-12 rounded-md shadow-md"
          onClick={() => router.push("/carts")}
        >
          <ChevronLeftIcon className="w-6 h-6 font-bold text-indigo-700" />
        </button>
        <h2 className="w-full font-semibold text-xl px-4 text-white bg-indigo-700 py-2 rounded-md shadow-md">
          Cart Detail {params.cartId}
        </h2>
      </div>

      <div className="my-4">
        <div className="text-lg font-semibold pl-2 mb-2">Details</div>
        <div className=" bg-indigo-500 rounded-md px-4 py-4 text-white shadow-lg">
          <div className="grid grid-cols-2">
            <div>Name: {data.name}</div>
            <div>Total Products: {data.totalQuantity}</div>
            <div>Total Quantity: {data.totalQuantity}</div>
            <div>
              Total Amount:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
              }).format(data.total)}
            </div>
          </div>
        </div>
      </div>

      <div className="my-4">
        <div className="text-lg font-semibold pl-2 mb-2">Products</div>
        <Table {...{ data: data.products || [], columns: columns }} />
      </div>
    </div>
  );
}
