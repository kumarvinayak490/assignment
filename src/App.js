import React from "react";
import Table from "./Table";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="w-full relative">
      <nav className="w-full h-20  flex items-center justify-between px-10 shadow-md backdrop-blur bg-slate-900/90    ">
        <h1 className="text-slate-200">Chezuba</h1>
        <ul className="flex gap-4">
          <li>
            <a href="#" className="text-slate-200">
              Contact Us
            </a>
          </li>
          <li>
            <a href="#" className="text-slate-200">
              About us
            </a>
          </li>
          <li>
            <a href="#" className="text-slate-200">
              Home
            </a>
          </li>
        </ul>
      </nav>
      <main className="min-h-[calc(100vh-5rem)] bg-slate-900 w-full flex flex-col items-center  p-10   ">
        <QueryClientProvider client={queryClient}>
          <Table />
        </QueryClientProvider>
      </main>
    </div>
  );
}

export default App;
