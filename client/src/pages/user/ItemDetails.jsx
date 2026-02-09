import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showClaimModal, setShowClaimModal] = useState(false);

    // Mock data - will be replaced with API call based on id
    const item = {
        id: 1,
        name: 'Blue Water Bottle',
        category: 'Water Bottle',
        location: 'Gym Floor',
        foundDate: '2024-02-09',
        color: 'Blue',
        description: 'Blue plastic water bottle with a black lid. Brand logo visible on the side.',
        additionalInfo: 'Found near the treadmill section in the cardio area.',
        status: 'available',
        addedBy: 'Admin Staff',
        contactInfo: 'Contact reception desk to claim'
    };

    const handleClaim = () => {
        // Will be replaced with API call
        alert('Your claim request has been submitted! Please visit the reception desk with a valid ID.');
        setShowClaimModal(false);
        navigate('/user/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/user/items')}
                className="flex items-center text-cyan-600 hover:text-cyan-700 font-semibold mb-6 group"
            >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Browse
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Item Image */}
                <div className="w-full h-96 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                    <span className="text-9xl">📦</span>
                </div>

                {/* Item Details */}
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">{item.name}</h1>
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                    Available
                                </span>
                                <span className="text-slate-600">• Found {new Date(item.foundDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Description</h2>
                        <p className="text-slate-700 leading-relaxed">{item.description}</p>
                        {item.additionalInfo && (
                            <p className="text-slate-700 leading-relaxed mt-2">{item.additionalInfo}</p>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">🏷️</span>
                                <div>
                                    <p className="text-sm text-slate-600">Category</p>
                                    <p className="font-semibold text-slate-900">{item.category}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">📍</span>
                                <div>
                                    <p className="text-sm text-slate-600">Location Found</p>
                                    <p className="font-semibold text-slate-900">{item.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">🎨</span>
                                <div>
                                    <p className="text-sm text-slate-600">Color</p>
                                    <p className="font-semibold text-slate-900">{item.color}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">📅</span>
                                <div>
                                    <p className="text-sm text-slate-600">Date Found</p>
                                    <p className="font-semibold text-slate-900">{new Date(item.foundDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How to Claim */}
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                            <span className="mr-2">ℹ️</span>
                            How to Claim This Item
                        </h3>
                        <ol className="space-y-2 text-slate-700">
                            <li>1. Click the "Claim This Item" button below</li>
                            <li>2. Visit the gym reception desk with a valid ID</li>
                            <li>3. Provide proof of ownership (description, unique features, etc.)</li>
                            <li>4. Collect your item after verification</li>
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowClaimModal(true)}
                            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md hover:shadow-lg"
                        >
                            Claim This Item
                        </button>
                        <button
                            onClick={() => navigate('/user/items')}
                            className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                        >
                            Continue Browsing
                        </button>
                    </div>
                </div>
            </div>

            {/* Claim Confirmation Modal */}
            {showClaimModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Claim This Item?</h2>
                            <p className="text-slate-600">
                                You're about to claim "{item.name}". Please make sure this is your item before proceeding.
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>⚠️ Important:</strong> You will need to visit the reception desk with valid ID to collect this item.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleClaim}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all"
                            >
                                Confirm Claim
                            </button>
                            <button
                                onClick={() => setShowClaimModal(false)}
                                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
