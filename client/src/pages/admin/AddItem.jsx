import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../services/itemService';

const AddItem = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        foundLocation: '',
        foundDate: ''
    });

    // Image state
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Only JPG, JPEG, and PNG files are allowed'
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size should not exceed 5MB'
                }));
                return;
            }

            setImage(file);
            setErrors(prev => ({
                ...prev,
                image: ''
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.foundLocation.trim()) newErrors.foundLocation = 'Found location is required';
        if (!formData.foundDate) newErrors.foundDate = 'Found date is required';
        if (!image) newErrors.image = 'Please upload an image';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('foundLocation', formData.foundLocation);
            data.append('foundDate', formData.foundDate);
            data.append('image', image);

            const response = await addItem(data);

            if (response.success) {
                alert('Item added successfully!');
                setFormData({
                    title: '',
                    description: '',
                    foundLocation: '',
                    foundDate: ''
                });
                clearImage();
                navigate('/admin/manage-items');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert(error.message || 'Failed to add item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Professional Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Add Lost Item
                </h1>
                <p className="text-slate-600">Register a new found item in the system</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                            Item Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-300'
                                } focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all`}
                            placeholder="e.g., Blue Water Bottle"
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-slate-300'
                                } focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none`}
                            placeholder="Describe the item in detail..."
                        />
                        {errors.description && (
                            <p className="mt-2 text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Location and Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="foundLocation" className="block text-sm font-semibold text-slate-900 mb-2">
                                Found Location *
                            </label>
                            <input
                                type="text"
                                id="foundLocation"
                                name="foundLocation"
                                value={formData.foundLocation}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.foundLocation ? 'border-red-500' : 'border-slate-300'
                                    } focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all`}
                                placeholder="e.g., Cardio Section"
                            />
                            {errors.foundLocation && (
                                <p className="mt-2 text-sm text-red-500">{errors.foundLocation}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="foundDate" className="block text-sm font-semibold text-slate-900 mb-2">
                                Found Date *
                            </label>
                            <input
                                type="date"
                                id="foundDate"
                                name="foundDate"
                                value={formData.foundDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.foundDate ? 'border-red-500' : 'border-slate-300'
                                    } focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all`}
                            />
                            {errors.foundDate && (
                                <p className="mt-2 text-sm text-red-500">{errors.foundDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Item Image *
                        </label>

                        {!imagePreview ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex flex-col items-center justify-center w-full h-64 border-2 ${errors.image ? 'border-red-500' : 'border-slate-300'
                                        } border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors`}
                                >
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center text-4xl mb-4">
                                            📷
                                        </div>
                                        <p className="mb-2 text-sm font-semibold text-slate-700">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            JPG, JPEG or PNG (Max 5MB)
                                        </p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-64 object-contain rounded-lg border-2 border-slate-200 bg-slate-50"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <span className="text-lg">🗑️</span>
                                </button>
                            </div>
                        )}

                        {errors.image && (
                            <p className="mt-2 text-sm text-red-500">{errors.image}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Adding Item...
                                </span>
                            ) : (
                                'Add Item'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/manage-items')}
                            className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
