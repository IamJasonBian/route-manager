import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { Route } from '../services/api';

interface RoutesDashboardProps {
  routes: Route[];
}

interface ChartPoint {
  x: Date;
  y: number;
  route: string;
  from: string;
  to: string;
  date: string;
  price: number;
}

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date for display in tooltips
const formatTooltipDate = (date: Date | string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const RoutesDashboard: React.FC<RoutesDashboardProps> = ({ routes }) => {
  if (routes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No routes available. Add a route to see price trends.</p>
      </div>
    );
  }

  // Prepare data points for the scatter plot
  const data: ChartPoint[] = routes.flatMap(route => 
    route.prices.map(price => ({
      x: new Date(price.date),
      y: price.price,
      route: `${route.from}-${route.to}`,
      from: route.from,
      to: route.to,
      date: typeof price.date === 'string' ? price.date : price.date.toISOString(),
      price: price.price,
    }))
  );

  // Get unique routes for legend
  const uniqueRoutes = Array.from(new Set(routes.map(r => `${r.from}-${r.to}`)));
  
  // Calculate price range for Y-axis
  const allPrices = routes.flatMap(route => route.prices.map(p => p.price));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const yDomain = [Math.floor(minPrice * 0.95), Math.ceil(maxPrice * 1.05)];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Flight Price Trends</h2>
      
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x"
              name="Date"
              tickFormatter={(date: Date) => format(date, 'MMM d')}
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="y"
              name="Price"
              domain={yDomain}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <ZAxis dataKey="route" name="Route" />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow">
                      <p className="font-medium">{data.from} → {data.to}</p>
                      <p className="text-sm text-gray-600">{formatTooltipDate(data.date)}</p>
                      <p className="font-semibold text-lg">{formatCurrency(data.price)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            {uniqueRoutes.map((route, index) => (
              <Scatter 
                key={route}
                name={route}
                data={data.filter(d => d.route === route)}
                fill={COLORS[index % COLORS.length]}
                shape="circle"
                isAnimationActive={false}
              >
                {data.filter(d => d.route === route).map((_, i) => (
                  <Cell 
                    key={`cell-${i}`} 
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.7}
                  />
                ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {uniqueRoutes.map((route, index) => (
          <div key={route} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">{route}</span>
          </div>
        ))}
      </div>
    </div>
  );
};