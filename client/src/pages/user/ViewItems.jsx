import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewItems = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        'All',
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

    // Mock data - will be replaced with API call
    const items = [
        {
            id: 1,
            name: 'Blue Water Bottle',
            category: 'Water Bottle',
            location: 'Gym Floor',
            foundDate: '2024-02-09',
            color: 'Blue',
            description: 'Blue plastic water bottle with a black lid'
        },
        {
            id: 2,
            name: 'White Gym Towel',
            category: 'Towel',
            location: 'Locker Room - Men',
            foundDate: '2024-02-08',
            color: 'White',
            description: 'White gym towel, standard size'
        },
        {
            id: 3,
            name: 'Wireless Earbuds',
            category: 'Earbuds/Headphones',
            location: 'Cardio Area',
            foundDate: '2024-02-08',
            color: 'Black',
            description: 'Black wireless earbuds with charging case'
        },
        {
            id: 4,
            name: 'Red Gym Bag',
            category: 'Bag/Backpack',
            location: 'Locker Room - Women',
            foundDate: '2024-02-07',
            color: 'Red',
            description: 'Red sports bag with Nike logo'
        },
        {
            id: 5,
            name: 'Metal Water Bottle',
            category: 'Water Bottle',
            location: 'Weight Area',
            foundDate: '2024-02-07',
            color: 'Silver',
            description: 'Insulated metal water bottle'
        },
        {
            id: 6,
            name: 'Black Phone Case',
            category: 'Phone',
            location: 'Reception',
            foundDate: '2024-02-06',
            color: 'Black',
            description: 'Black phone case for iPhone'
        }
    ];

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleViewDetails = (itemId) => {
        navigate(`/user/item-details/${itemId}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Browse Found Items
                </h1>
                <p className="text-slate-600">Search for your lost belongings</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <input
                    type="text"
                    placeholder="Search by item name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${(category === 'All' && selectedCategory === 'all') || selectedCategory === category
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-600">
                    Found <span className="font-semibold text-slate-900">{filteredItems.length}</span> items
                </p>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleViewDetails(item.id)}
                    >
                        {/* Item Image Placeholder */}
                        <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-6xl">📦</span>
                        </div>

                        {/* Item Info */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">🏷️</span>
                                <span>{item.category}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">📍</span>
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">📅</span>
                                <span>{new Date(item.foundDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">🎨</span>
                                <span>Color: {item.color}</span>
                            </div>
                        </div>

                        <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all">
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                    <p className="text-slate-600">Try adjusting your search or category filter</p>
                </div>
            )}
        </div>
    );
};

export default ViewItems;
