import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead, deleteNotification } from '../../services/notificationService';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            // Update local state
            if (id === 'all') {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            } else {
                setNotifications(notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ));
            }
            // Trigger a custom event to update Navbar badge if we want perfectly sync, or just rely on page refresh for now
            // Simple way: dispatch event
            window.dispatchEvent(new Event('notificationUpdated'));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(notifications.filter(n => n._id !== id));
            window.dispatchEvent(new Event('notificationUpdated'));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'error': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-sky-50 text-sky-700 border-sky-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
                    <p className="text-slate-500">Stay updated with your claim status.</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={() => handleMarkAsRead('all')}
                        className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                        <div className="text-4xl mb-4">🔕</div>
                        <h3 className="text-lg font-medium text-slate-900">No Notifications</h3>
                        <p className="text-slate-500 mt-2">You're all caught up!</p>
                        <Link to="/user/items" className="inline-block mt-4 text-sky-600 font-semibold hover:underline">
                            Browse Items
                        </Link>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`relative p-5 rounded-xl border transition-all ${notification.isRead
                                    ? 'bg-white border-slate-200 opacity-75'
                                    : 'bg-white border-sky-200 shadow-md ring-1 ring-sky-100'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-semibold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                            {notification.title}
                                            {!notification.isRead && (
                                                <span className="ml-2 w-2 h-2 inline-block bg-sky-500 rounded-full"></span>
                                            )}
                                        </h3>
                                        <span className="text-xs text-slate-400">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 ml-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="text-xs font-medium text-sky-600 hover:text-sky-800"
                                            title="Mark as read"
                                        >
                                            Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification._id)}
                                        className="text-xs font-medium text-slate-400 hover:text-red-600"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
