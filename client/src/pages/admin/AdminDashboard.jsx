import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';
import StatCard from '../../components/admin/dashboard/StatCard';
import Charts from '../../components/admin/dashboard/Charts';
import ActivityFeed from '../../components/admin/dashboard/ActivityFeed';
import DashboardLoader from '../../components/admin/dashboard/DashboardLoader';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <DashboardLoader />;
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={fetchStats}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Items"
                    count={stats.items.total}
                    icon="📦"
                    color="blue"
                    subtext={`${stats.items.available} Available`}
                />
                <StatCard
                    title="Claimed Items"
                    count={stats.items.claimed}
                    icon="🤝"
                    color="yellow"
                    subtext={`${stats.items.collected} Collected`}
                />
                <StatCard
                    title="Pending Claims"
                    count={stats.claims.pending}
                    icon="⏳"
                    color="purple"
                    subtext="Requires Action"
                />
                <StatCard
                    title="Total Processed"
                    count={stats.claims.approved + stats.claims.rejected}
                    icon="✅"
                    color="green"
                    subtext="Approvals & Rejections"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                <Charts itemStats={stats.items} claimStats={stats.claims} />
            </div>

            {/* Recent Activity Section */}
            <div>
                <ActivityFeed
                    recentItems={stats.recentActivity.items}
                    recentClaims={stats.recentActivity.claims}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
