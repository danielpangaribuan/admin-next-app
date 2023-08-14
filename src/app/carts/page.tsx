"use client";
import Table from "@/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import * as _ from "lodash";
import { useRouter } from "next/navigation";

async function getCarts() {
  const resCarts = await fetch("https://dummyjson.com/carts?limit=1000");
  const dataCarts = await resCarts.json();

  const resUser = await fetch("https://dummyjson.com/users?limit=1000");
  const dataUser = await resUser.json();

  const data = _.map(dataCarts.carts, function (item) {
    const cartUser = _.find(dataUser.users, { id: item.userId });
    return _.extend(item, {
      firstName: cartUser.firstName,
      lastName: cartUser.lastName,
      phone: cartUser.phone,
      email: cartUser.email,
    });
  });
  return data;
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

function Carts() {
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await getCarts();
      setData(response);
    };
    fetchData();
  }, []);

  const columns = useMemo<ColumnDef<ColumnKey>[]>(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "Total Product",
        accessorKey: "totalProducts",
      },
      {
        header: "Total Quantity",
        accessorKey: "totalQuantity",
      },
      {
        header: "Total Price",
        accessorKey: "total",
        cell: (cell: any) => {
          const currency = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "USD",
          }).format(cell.getValue());
          return <span>{currency}</span>;
        },
      },
      {
        header: "",
        accessorKey: "id",
        cell: (cell) => {
          return (
            <div
              className="py-1 px-2 border border-neutral-200 rounded-lg bg-indigo-700 hover:bg-indigo-900 text-white cursor-pointer text-center shadow"
              onClick={() => router.push(`carts/${cell.getValue()}`)}
            >
              Get Detail Cart
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="bg-white p-4 rounded overflow-hidden shadow-lg">
      <h2 className="font-semibold text-xl px-4 text-white bg-indigo-700 py-2 rounded-md shadow-md mb-4">
        Carts List
      </h2>
      <Table {...{ data: data || [], columns: columns }} />
    </div>
  );
}

export default Carts;
