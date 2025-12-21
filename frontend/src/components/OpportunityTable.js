import React, { useState } from 'react';

const OpportunityTable = ({ opportunities }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpps = opportunities.filter(opp => 
    opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Header - Matches Screenshot #2 Action Bar */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h2 className="text-lg font-semibold text-gray-800">Deal Pipeline</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search this list..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast Close Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Responsible</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Opportunity Value</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50 bg-white">
            {filteredOpps.map((opp) => (
              <tr key={opp.id} className="hover:bg-blue-50/20 transition-colors group cursor-default">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                  {opp.name}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                  {opp.organization?.name || "---"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {opp.expectedClose ? new Date(opp.expectedClose).toLocaleDateString('en-GB', {
                     day: '2-digit', month: 'short', year: '2-digit'
                  }).replace(/ /g, '-') : "---"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                  {opp.user?.email.split('@')[0] || "Garland Shields"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                  USD ${Number(opp.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpportunityTable;