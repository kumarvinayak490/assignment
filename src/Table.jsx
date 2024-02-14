import React, { useEffect, useMemo } from "react";
import { useState, useRef, useContext } from "react";
import { FixedSizeList, VariableSizeList } from "react-window";
import { render } from "react-dom";
import { TEInput, TESelect } from "tw-elements-react";
import axios from "axios";
import { useQuery } from "react-query";

const typeIdOptions = [
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "5", value: 5 },
  { text: "6", value: 6 },
  { text: "7", value: 7 },
  { text: "8", value: 8 },
  { text: "9", value: 9 },
  { text: "10", value: 10 },
  { text: "11", value: 11 },
  { text: "12", value: 12 },
  { text: "13", value: 13 },
  { text: "14", value: 14 },
];

const colorCode = {
  1: "before:bg-red-500",
  2: "before:bg-blue-500",
  3: "before:bg-green-500",
  4: "before:bg-yellow-500",
  5: "before:bg-cyan-500",
  6: "before:bg-green-500",
  7: "before:bg-teal-500",
  8: "before:bg-pink-500",
  9: "before:bg-orange-500",
  10: "before:bg-white",
  11: "before:bg-gray-500",
  12: "before:bg-lime-500",
  13: "before:bg-red-100",
  14: "before:bg-red-100",
};

const columns = [
  "OrderLineID",
  "OrderID",
  "StockItemID",
  "Description",
  "PackageTypeID",
  "Quantity",
  "UnitPrice",
];

const fetchData = async (quantity, typeId) => {
  try {
    const res = await axios.get(
      `https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=${typeId}&quantity=${quantity}`
    );
    res.data.sort((a, b) => a.OrderLineID - b.OrderLineID);
    return res.data;
  } catch (err) {
    return [];
  }
};

const VirtualTableContext = React.createContext({
  top: 0,
  setTop: () => {},
  header: <></>,
});

const TableDataContext = React.createContext({
  data: [],
  isLoading: false,
});

const columnWidths = {
  OrderLineID: "10%",
  OrderID: "10%",
  StockItemID: "15%",
  Description: "30%",
  PackageTypeID: "15%",
  Quantity: "10%",
  UnitPrice: "10%",
};

function VirtualTable({ row, header, ...rest }) {
  const listRef = useRef();
  const [top, setTop] = useState(0);

  return (
    <VirtualTableContext.Provider value={{ top, setTop, header }}>
      <VariableSizeList
        {...rest}
        innerElementType={Inner}
        onItemsRendered={(props) => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex);
          setTop((style && style.top) || 0);

          // Call the original callback
          rest.onItemsRendered && rest.onItemsRendered(props);
        }}
        ref={(el) => (listRef.current = el)}
      >
        {row}
      </VariableSizeList>
    </VirtualTableContext.Provider>
  );
}

function Row({ index }) {
  const { data, isLoading } = useContext(TableDataContext);
  if (isLoading)
    return (
      <tr className="animate-pulse">
        {columns.map((col) => {
          return (
            <td
              style={{ height: "36px", width: columnWidths[col] }}
              className=" bg-gray-500 mb-6  "
            ></td>
          );
        })}
      </tr>
    );
  if (data.length === 0) return null;
  return (
    <tr id={`row${index}`}>
      {columns.map((col) => {
        if (col === "PackageTypeID") {
          return (
            <td
              style={{ height: "36px", width: columnWidths[col] }}
              className={`border-b relative before:w-3 before:h-3 before:rounded-full before:absolute before:top-1/2 before:left-1/3 before:-translate-y-1/2  ${
                data[index] ? colorCode[data[index][col]] : ""
              } border-slate-600 text-center text-slate-500`}
            >
              {data[index] && data[index][col]}
            </td>
          );
        }
        return (
          <td
            style={{ height: "36px", width: columnWidths[col] }}
            className="border-b border-slate-600 text-center   text-slate-500 "
          >
            {data[index] && data[index][col]}
          </td>
        );
      })}
    </tr>
  );
}

const Inner = React.forwardRef(function Inner({ children, ...rest }, ref) {
  const { header, top } = useContext(VirtualTableContext);
  return (
    <div {...rest} ref={ref}>
      <table style={{ top, position: "absolute", width: "100%" }}>
        {header}
        <tbody className="bg-slate-800">{children}</tbody>
      </table>
    </div>
  );
});

const Table = () => {
  const [quantity, setQuantity] = useState(1);
  const [typeId, setTypeId] = useState(1);
  const quantityRef = useRef(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getAllOrders", quantity, typeId],
    queryFn: () => fetchData(quantity, typeId),
  });

  return (
    <TableDataContext.Provider value={{ data, isLoading }}>
      <VirtualTable
        height={500}
        width="100%"
        itemCount={data ? data.length : 15}
        itemSize={(index) => {
          const el = document.getElementById(`row${index}`);
          if (el) return el.offsetHeight;
          return 36;
        }}
        header={
          <thead className="bg-slate-700 sticky top-0 rounded transition-all z-10">
            <tr className="bg-slate-900 rounded">
              <th colSpan={7}>
                <div className="flex justify-between p-4  bg-slate-600 rounded-t  w-full ">
                  <div>
                    <TESelect
                      data={typeIdOptions}
                      label="Select Type Id"
                      value={typeId}
                      onValueChange={(data) => {
                        setTypeId(data.value);
                      }}
                    />
                  </div>
                  <form
                    className="flex items-center gap-x-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <TEInput
                      type="number"
                      id="Quantity"
                      label="Quantity"
                      ref={quantityRef}
                    ></TEInput>
                    <button
                      type="submit"
                      onClick={() => {
                        if (quantityRef.current.value) {
                          setQuantity(Number(quantityRef.current.value));
                          quantityRef.current.focus();
                        }
                      }}
                      class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                      Apply Filter
                    </button>
                  </form>
                </div>
              </th>
            </tr>
            <tr className="p-4">
              {columns.map((col) => {
                return (
                  <th className="border-b  font-medium p-4  text-slate-400  text-center">
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
        }
        row={Row}
      />
    </TableDataContext.Provider>
  );
};

export default Table;
