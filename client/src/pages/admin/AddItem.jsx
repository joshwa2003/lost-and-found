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
        // Clear error for this field
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
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Only JPG, JPEG, and PNG files are allowed'
                }));
                return;
            }

            // Validate file size (5MB)
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

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Clear image
    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.foundLocation.trim()) {
            newErrors.foundLocation = 'Found location is required';
        }

        if (!formData.foundDate) {
            newErrors.foundDate = 'Found date is required';
        }

        if (!image) {
            newErrors.image = 'Please upload an image';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create FormData
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('foundLocation', formData.foundLocation);
            data.append('foundDate', formData.foundDate);
            data.append('image', image);

            // Call API
            const response = await addItem(data);

            if (response.success) {
                // Show success message (you can add toast here)
                alert('Item added successfully!');

                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    foundLocation: '',
                    foundDate: ''
                });
                clearImage();

                // Redirect to manage items
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
            {/* Page Header */}
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Add Lost Item ➕
                    </h1>
                    <p className="text-cyan-100 text-lg">Register a new found item in the system</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-slate-900 mb-2">
                            Item Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-slate-300'
                                } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                            placeholder="e.g., Blue Water Bottle"
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-slate-300'
                                } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none`}
                            placeholder="Describe the item in detail..."
                        />
                        {errors.description && (
                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Location and Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Found Location */}
                        <div>
                            <label htmlFor="foundLocation" className="block text-sm font-bold text-slate-900 mb-2">
                                Found Location *
                            </label>
                            <input
                                type="text"
                                id="foundLocation"
                                name="foundLocation"
                                value={formData.foundLocation}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.foundLocation ? 'border-red-500' : 'border-slate-300'
                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                                placeholder="e.g., Cardio Section"
                            />
                            {errors.foundLocation && (
                                <p className="mt-2 text-sm text-red-500 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.foundLocation}
                                </p>
                            )}
                        </div>

                        {/* Found Date */}
                        <div>
                            <label htmlFor="foundDate" className="block text-sm font-bold text-slate-900 mb-2">
                                Found Date *
                            </label>
                            <input
                                type="date"
                                id="foundDate"
                                name="foundDate"
                                value={formData.foundDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.foundDate ? 'border-red-500' : 'border-slate-300'
                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                            />
                            {errors.foundDate && (
                                <p className="mt-2 text-sm text-red-500 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.foundDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
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
                                        } border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-slate-50 to-cyan-50 hover:from-cyan-50 hover:to-blue-50 transition-all duration-300`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                                            📷
                                        </div>
                                        <p className="mb-2 text-sm font-bold text-slate-700">
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
                                    className="w-full h-64 object-contain rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                                >
                                    <span className="text-lg">🗑️</span>
                                </button>
                            </div>
                        )}

                        {errors.image && (
                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 relative px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
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
                                <>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative flex items-center justify-center">
                                        <span className="mr-2">Add Item</span>
                                        <span className="text-xl">✅</span>
                                    </span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/manage-items')}
                            className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
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
