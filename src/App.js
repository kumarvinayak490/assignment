import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TEInput, TESelect } from "tw-elements-react";

function App() {
  const [orderData, setOrderData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [typeId, setTypeId] = useState(1);

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

  const dataTobeMapped = useMemo(() => {
    return orderData;
  }, [orderData]);

  useEffect(() => {
    let shouldFetch = true;
    const timer = setTimeout(() => {
      (async () => {
        try {
          if (shouldFetch) {
            const res = await axios.get(
              `https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=${typeId}&quantity=${quantity}`
            );
            setOrderData(res.data);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }, 2000);

    return () => {
      shouldFetch = false;
      clearTimeout(timer);
    };
  }, [quantity, typeId]);

  const columns = [
    "OrderLineID",
    "OrderID",
    "StockItemID",
    "Description",
    "PackageTypeID",
    "Quantity",
    "UnitPrice",
  ];

  return (
    <div className="w-full h-screen overflow-scroll relative">
      <nav className="w-full h-20  flex items-center justify-between px-10 shadow-md  ">
        <h1>Chezuba</h1>
        <ul className="flex gap-4">
          <li>Contact Us</li>
          <li>About Us</li>
          <li>Dashboard</li>
        </ul>
      </nav>
      <main className="min-h-[calc(100vh-5rem)]  bg-slate-900 w-full flex flex-col items-center  p-10   ">
        <table className="border-collapse table-fixed text-sm w-10/12 rounded    ">
          <thead className="bg-slate-700 sticky top-0 rounded transition-all">
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
                  <div>
                    <TEInput
                      type="number"
                      id="Quantity"
                      label="Quantity"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    ></TEInput>
                  </div>
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
          <tbody className="bg-slate-800">
            {orderData.map((order) => {
              return (
                <tr>
                  {columns.map((col) => {
                    return (
                      <td className="border-b border-slate-600 text-center   text-slate-500 ">
                        {order[col]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
