import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Charts = ({ itemStats, claimStats }) => {

    // Prepare data for Pie Chart (Item Status)
    const itemData = [
        { name: 'Available', value: itemStats.available, color: '#10B981' }, // Emerald-500
        { name: 'Claimed', value: itemStats.claimed, color: '#F59E0B' },    // Amber-500
        { name: 'Collected', value: itemStats.collected, color: '#3B82F6' } // Blue-500
    ].filter(d => d.value > 0);

    // Prepare data for Bar Chart (Claim Status)
    const claimData = [
        { name: 'Pending', count: claimStats.pending },
        { name: 'Approved', count: claimStats.approved },
        { name: 'Rejected', count: claimStats.rejected }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Item Status Distribution</h3>
                <div className="h-64 w-full">
                    {itemData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={itemData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {itemData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            No Item Data
                        </div>
                    )}
                </div>
            </div>

            {/* Claims Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Claims Overview</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={claimData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#F1F5F9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {claimData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.name === 'Pending' ? '#F59E0B' :
                                            entry.name === 'Approved' ? '#10B981' :
                                                '#EF4444'
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
