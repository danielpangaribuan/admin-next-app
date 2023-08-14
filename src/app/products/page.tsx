"use client";
import Table from "@/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import * as _ from "lodash";

async function getProducts(filter: any) {
  const response = await fetch("https://dummyjson.com/products");
  const resJson = await response.json();
  const data = resJson.products;

  if (Object.values(filter).some((v: any) => v.length)) {
    const newData: any = _.filter(data, (v: any) => {
      const brandOrigin = v.brand.toLowerCase();
      const brandFilter = filter.brand.toLowerCase();

      const productOrigin = v.title.toLowerCase();
      const productFilter = filter.product.toLowerCase();

      const categoryOrigin = v.category.toLowerCase();
      const categoryFilter = filter.category.toLowerCase();

      const minPriceFilter = filter.minPrice.length
        ? v.price > parseFloat(filter.minPrice)
        : true;

      const maxPriceFilter = filter.maxPrice.length
        ? v.price < parseFloat(filter.maxPrice)
        : true;

      return (
        brandOrigin.includes(brandFilter) &&
        productOrigin.includes(productFilter) &&
        categoryOrigin.includes(categoryFilter) &&
        minPriceFilter &&
        maxPriceFilter
      );
    });

    return newData;
  }
  return data;
}

async function getProductsCategory() {
  const response = await fetch("https://dummyjson.com/products/categories");
  const data = await response.json();
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

function Products() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    brand: "",
    product: "",
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const [category, setCategory] = useState([]);

  const getDataProduct = (filter: object) => {
    const fetchData = async () => {
      const resData = await getProducts(filter);
      setData(resData);
    };
    fetchData();
  };

  const getDateCategory = () => {
    const fetchData = async () => {
      const resCat = await getProductsCategory();
      setCategory(
        resCat.map((v: String) => ({
          value: v,
          label: v.replace("-", " "),
        }))
      );
    };
    fetchData();
  };

  useEffect(() => {
    const dataFilter = window.localStorage.getItem("PRODUCT_FILTER");
    if (dataFilter !== null) setFilter(JSON.parse(dataFilter));

    getDataProduct(filter);
    getDateCategory();
  }, []);

  const submitFilter = () => {
    window.localStorage.setItem("PRODUCT_FILTER", JSON.stringify(filter));
    getDataProduct(filter);
  };

  const columns = useMemo<ColumnDef<ColumnKey>[]>(
    () => [
      {
        header: "Product Name",
        accessorKey: "title",
      },
      {
        header: "Brand",
        accessorKey: "brand",
      },
      {
        header: "Price",
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
        header: "Stock",
        accessorKey: "stock",
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: (cell: any) => {
          return (
            <span className="capitalize">
              {cell.getValue().replaceAll("-", " ")}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="font-semibold text-xl px-4 text-white bg-indigo-700 py-2 rounded-md shadow-md mb-4">
        Products List
      </h2>
      <div className="flex flex-col gap-y-4 px-4 py-4 border border-neutral-300 rounded-lg my-4">
        <div className="grid grid-cols-4 gap-x-4">
          <div>
            <span className="font-semibold text-base">Brand</span>
            <input
              type="text"
              className="border block h-[38px] py-0.5 px-2 w-full rounded-[4px] border-[#cccccc]"
              value={filter.brand}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, brand: e.target.value }))
              }
              placeholder="Search Brand"
            />
          </div>
          <div>
            <span className="font-semibold text-base">Product</span>
            <input
              type="text"
              className="border block h-[38px] py-0.5 px-2 w-full rounded-[4px] border-[#cccccc]"
              placeholder="Search Product"
              value={filter.product}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, product: e.target.value }))
              }
            />
          </div>
          <div>
            <span className="font-semibold text-base">Price Range</span>
            <div className="grid grid-cols-2 gap-x-2">
              <input
                type="text"
                placeholder="Input Min Price"
                className="border block h-[38px] py-0.5 px-2 w-full rounded-[4px] border-[#cccccc]"
                value={filter.minPrice}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, minPrice: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Input Max Price"
                className="border block h-[38px] py-0.5 px-2 w-full rounded-[4px] border-[#cccccc]"
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <span className="font-semibold text-base">Category</span>
            <Select
              options={[{ label: "Select Category", value: "" }, ...category]}
              placeholder="Select Category"
              className="capitalize"
              value={[
                {
                  label:
                    filter.category === ""
                      ? "Select Category"
                      : filter.category,
                  value: filter.category,
                },
              ]}
              onChange={(opt: any) => {
                setFilter((prev) => ({ ...prev, category: opt.value }));
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4">
          <button
            className="col-end-5 inline-block w-full bg-indigo-700 rounded-md text-white py-2"
            onClick={() => submitFilter()}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="mt-4">
        <Table {...{ data: data || [], columns: columns }} />
      </div>
    </div>
  );
}

export default Products;
