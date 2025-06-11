import React, { useState } from 'react';
import { PlusCircleIcon } from 'lucide-react';
export const AddRouteForm = ({
  onAddRoute
}) => {
  const [routeData, setRouteData] = useState({
    from: '',
    to: '',
    basePrice: '',
    duration: '',
    distance: '',
    stops: ''
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setRouteData(prev => ({
      ...prev,
      [name]: name === 'basePrice' ? parseInt(value) || '' : value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    const legs = routeData.stops
      ? [routeData.from, ...routeData.stops.split(',').map(s => s.trim()), routeData.to]
          .slice(0, -1)
          .map((from, idx, arr) => ({ from, to: arr[idx + 1] }))
      : [{ from: routeData.from, to: routeData.to }];
    onAddRoute({ ...routeData, legs });
    setRouteData({
      from: '',
      to: '',
      basePrice: '',
      duration: '',
      distance: '',
      stops: ''
    });
  };
  return <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Route
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input type="text" id="from" name="from" value={routeData.from} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input type="text" id="to" name="to" value={routeData.to} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
            Base Price ($)
          </label>
          <input type="number" id="basePrice" name="basePrice" value={routeData.basePrice} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input type="text" id="duration" name="duration" placeholder="e.g. 7h 25m" value={routeData.duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distance
            </label>
            <input type="text" id="distance" name="distance" placeholder="e.g. 3,461 miles" value={routeData.distance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">
            Stops (comma separated)
          </label>
          <input type="text" id="stops" name="stops" placeholder="e.g. LHR,FCO" value={routeData.stops} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Route
        </button>
      </form>
    </div>;
};