import React from 'react';

interface StatCard {
  title: string;
  value: number | string;
  unit?: string;
  percentage?: number;
  icon?: string;
}

interface StatCardsProps {
  data: StatCard[];
}

const StatCards: React.FC<StatCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {item.title}
              </p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                  {item.unit && (
                    <span className="text-sm font-medium text-gray-500 ml-1">
                      {item.unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {item.icon && (
              <div className="bg-gray-100 p-3 rounded-full">
                {/* You can replace this with actual icons from your icon library */}
                <span className="text-gray-600 text-xl">
                  {getIconComponent(item.icon)}
                </span>
              </div>
            )}
          </div>
          {!isNaN(item.percentage as number) && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {item.percentage}% utilized
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper function to simulate icons (replace with your actual icon components)
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'server':
      return '🖥️';
    case 'cpu':
      return '⚡';
    case 'memory':
      return '🧠';
    case 'container':
      return '📦';
    default:
      return '📊';
  }
};

export default StatCards;