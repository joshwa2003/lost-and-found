import React, { useState, useEffect } from 'react';
import { getAllClaims, updateClaimStatus } from '../../services/claimService';
import { markItemCollected } from '../../services/itemService';
import AdminClaimTable from '../../components/admin/AdminClaimTable';
import ClaimActionModal from '../../components/admin/ClaimActionModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminClaims = () => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search/Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'collected'
    const [actionLoading, setActionLoading] = useState(false);

    // Auth verification (double check on component level)
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/user/dashboard');
            return;
        }
        fetchClaims();
    }, [user, navigate]);

    // Filtering Effect
    useEffect(() => {
        let result = claims;

        // Filter by Status
        if (statusFilter !== 'all') {
            result = result.filter(claim => claim.status === statusFilter);
        }

        // Search by User or Item Title
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(claim =>
                claim.userId?.name?.toLowerCase().includes(query) ||
                claim.userId?.email?.toLowerCase().includes(query) ||
                claim.itemId?.title?.toLowerCase().includes(query)
            );
        }

        setFilteredClaims(result);
    }, [claims, searchQuery, statusFilter]);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const response = await getAllClaims();
            if (response.success) {
                setClaims(response.data);
                setFilteredClaims(response.data);
            }
        } catch (err) {
            console.error('Error fetching claims:', err);
            setError('Failed to load claims.');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (action, claim) => {
        setSelectedClaim(claim);
        setActionType(action);
        setModalOpen(true);
    };

    const handleConfirmAction = async (adminComment) => {
        if (!selectedClaim || !actionType) return;

        try {
            setActionLoading(true);

            // Map action type to status
            let newStatus;

            if (actionType === 'collected') {
                // Special handling for collected items
                // 1. Mark item as collected (this archives it)
                await markItemCollected(selectedClaim.itemId._id, selectedClaim.userId._id);

                // 2. Update claim status to collected/completed to keep records consistent
                await updateClaimStatus(selectedClaim._id, 'collected', adminComment);
            } else {
                // Normal status update
                if (actionType === 'approve') newStatus = 'approved';
                else if (actionType === 'reject') newStatus = 'rejected';

                await updateClaimStatus(selectedClaim._id, newStatus, adminComment);
            }

            // Refresh Data
            await fetchClaims();
            setModalOpen(false);

            // Optional: Success Toast here
        } catch (err) {
            console.error('Error updating claim:', err);
            alert('Failed to update claim status: ' + (err.message || 'Unknown error'));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading claims...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Claims</h1>
                <p className="text-slate-500">Review and manage item claims from users.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by user or item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Filter Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="all">All Claims</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="collected">Collected</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredClaims.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-lg font-medium">No claims found matching your criteria.</p>
                    </div>
                ) : (
                    <AdminClaimTable
                        claims={filteredClaims}
                        onAction={handleActionClick}
                    />
                )}
            </div>

            {/* Action Modal */}
            <ClaimActionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmAction}
                action={actionType}
                claim={selectedClaim}
                loading={actionLoading}
            />
        </div>
    );
};

export default AdminClaims;
