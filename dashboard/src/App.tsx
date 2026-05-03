import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Receipt, TrendingUp } from 'lucide-react';

interface ReceiptData {
  id: number;
  store_name: string;
  total_amount: number;
  date: string;
}

function App() {
  const [data, setData] = useState<ReceiptData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/receipts');
        // If API is empty, show some mock data for demo
        const displayData = response.data.length > 0 ? response.data : [
          { id: 1, store_name: '7-Eleven', total_amount: 120, date: '2024-05-01' },
          { id: 2, store_name: 'Starbucks', total_amount: 350, date: '2024-05-02' },
          { id: 3, store_name: 'Tesco', total_amount: 890, date: '2024-05-03' },
        ];
        setData(displayData);
      } catch (err) {
        console.error("Error fetching data", err);
        // Fallback mock data
        setData([
          { id: 1, store_name: '7-Eleven', total_amount: 120, date: '2024-05-01' },
          { id: 2, store_name: 'Starbucks', total_amount: 350, date: '2024-05-02' },
          { id: 3, store_name: 'Tesco', total_amount: 890, date: '2024-05-03' },
        ]);
      }
    };
    fetchData();
  }, []);

  const totalSpend = data.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Receipt Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><TrendingUp className="text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Total Spending</p>
                <p className="text-2xl font-bold">฿{totalSpend.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg"><Receipt className="text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Receipts Scanned</p>
                <p className="text-2xl font-bold">{data.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Spending by Store</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
