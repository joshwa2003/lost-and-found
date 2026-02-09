import { useState } from 'react';

const AddLostItem = () => {
    const [itemData, setItemData] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        foundDate: '',
        color: '',
        status: 'found'
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = [
        'Water Bottle',
        'Towel',
        'Keys',
        'Wallet',
        'Phone',
        'Earbuds/Headphones',
        'Clothing',
        'Bag/Backpack',
        'Jewelry',
        'Other'
    ];

    const locations = [
        'Locker Room - Men',
        'Locker Room - Women',
        'Gym Floor',
        'Reception',
        'Cardio Area',
        'Weight Area',
        'Studio',
        'Parking Lot'
    ];

    const handleChange = (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);

            // Reset form
            setItemData({
                name: '',
                category: '',
                description: '',
                location: '',
                foundDate: '',
                color: '',
                status: 'found'
            });

            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Add Found Item
                </h1>
                <p className="text-slate-600">Register a new item found at the gym</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="font-semibold">Item added successfully!</p>
                        <p className="text-sm">It will now be visible to gym members.</p>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Item Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={itemData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="e.g., Blue Water Bottle"
                        />
                    </div>

                    {/* Category & Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={itemData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="color" className="block text-sm font-semibold text-slate-900 mb-2">
                                Color
                            </label>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                value={itemData.color}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                placeholder="e.g., Blue, Red"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={itemData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                            placeholder="Provide detailed description of the item..."
                        ></textarea>
                    </div>

                    {/* Location & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-slate-900 mb-2">
                                Location Found *
                            </label>
                            <select
                                id="location"
                                name="location"
                                value={itemData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                <option value="">Select location</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="foundDate" className="block text-sm font-semibold text-slate-900 mb-2">
                                Date Found *
                            </label>
                            <input
                                type="date"
                                id="foundDate"
                                name="foundDate"
                                value={itemData.foundDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Image Upload Placeholder */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Item Photo
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-slate-600 text-sm">Click to upload or drag and drop</p>
                            <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 5MB (Coming in Day 6)</p>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {submitting ? 'Adding Item...' : 'Add Item'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLostItem;
