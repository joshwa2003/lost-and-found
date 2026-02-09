import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role
            const userRole = result.user.role;
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (userRole === 'user') {
                navigate('/user/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 gym-pattern opacity-30"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-3 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                            <span className="text-white font-bold text-3xl">💪</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">Welcome Back!</h1>
                    <p className="text-slate-600">Sign in to access the Lost & Found Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo Credentials Info */}
                    <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <p className="text-xs text-cyan-800 font-semibold mb-2">📌 Demo Credentials:</p>
                        <div className="text-xs text-slate-600 space-y-1">
                            <p><strong>Admin:</strong> admin@gym.com / admin123</p>
                            <p><strong>User:</strong> user@gym.com / user123</p>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
