import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../../services/itemService';

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        foundLocation: '',
        foundDate: '',
        category: 'Others', // Default
        image: null
    });

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        try {
            const response = await getItemById(id);
            if (response.success) {
                const item = response.item;
                setFormData({
                    title: item.title,
                    description: item.description,
                    foundLocation: item.foundLocation,
                    foundDate: new Date(item.foundDate).toISOString().split('T')[0],
                    category: item.category || 'Others',
                    image: null // We don't pre-fill file input
                });
                setImagePreview(`http://localhost:5001/uploads/${item.image}`);
            }
        } catch (err) {
            console.error('Error fetching item:', err);
            setError('Failed to load item details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('foundLocation', formData.foundLocation);
        data.append('foundDate', formData.foundDate);
        data.append('category', formData.category);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await updateItem(id, data);
            if (response.success) {
                navigate('/admin/manage-items');
            }
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err.message || 'Failed to update item');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Item</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Found Location</label>
                            <input
                                type="text"
                                name="foundLocation"
                                value={formData.foundLocation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date Found</label>
                            <input
                                type="date"
                                name="foundDate"
                                value={formData.foundDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Item Image</label>
                        <div className="flex items-center space-x-6">
                            <div className="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/manage-items')}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItem;
