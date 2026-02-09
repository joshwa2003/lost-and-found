import gymHero from '../assets/images/gym-hero.png';
import gymLockers from '../assets/images/gym-lockers.png';
import gymBg from '../assets/images/gym-bg.png';

const Home = () => {
    const features = [
        {
            icon: '💪',
            title: 'Locker Room Coverage',
            desc: 'Track items lost in locker rooms, gym floors, and common areas'
        },
        {
            icon: '📱',
            title: 'Quick Reports',
            desc: 'Report lost items instantly from your phone or gym kiosk'
        },
        {
            icon: '🔔',
            title: 'Instant Alerts',
            desc: 'Get notified immediately when your item is found'
        },
        {
            icon: '✅',
            title: 'Member Verification',
            desc: 'Secure verification process for gym members only'
        },
        {
            icon: '📊',
            title: 'Track Status',
            desc: 'Monitor the status of your lost item reports'
        },
        {
            icon: '🏋️',
            title: 'Fitness First',
            desc: "Focus on your workout, we'll handle the rest"
        }
    ];

    const stats = [
        { number: '500+', label: 'Items Returned' },
        { number: '2K+', label: 'Gym Members' },
        { number: '92%', label: 'Recovery Rate' },
        { number: '<12h', label: 'Avg. Return Time' }
    ];

    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50 py-20 md:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 gym-pattern"></div>

                {/* Background Image */}
                <div className="absolute inset-0 opacity-5">
                    <img src={gymBg} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 bg-cyan-100 rounded-full px-4 py-2 mb-6">
                                <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                <span className="text-sm font-semibold text-cyan-800">Trusted Gym Portal</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                                Lost Your <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Gym Gear?</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                The smart Lost & Found system for gym members. Report lost items, browse found belongings, and get back to your workout.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                <button className="btn-primary">
                                    Report Lost Item
                                </button>
                                <button className="btn-secondary">
                                    Browse Found Items
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="card p-4">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs text-slate-600 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <img
                                src={gymHero}
                                alt="Gym Equipment"
                                className="w-full max-w-lg mx-auto drop-shadow-xl rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="section-title">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Simple features to help you recover your gym belongings quickly
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="card text-center hover:border-cyan-200 transition-all">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 md:py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="section-title">How It Works</h2>
                        <p className="text-xl text-slate-600">Simple 3-step process</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            { step: '1', title: 'Report', desc: 'Tell us what you lost - water bottle, towel, keys, etc.', icon: '📝' },
                            { step: '2', title: 'We Search', desc: 'Our system checks all found items at the gym', icon: '🔍' },
                            { step: '3', title: 'Pick Up', desc: 'Claim your item at the front desk with ID verification', icon: '✅' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    {item.step}
                                </div>
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locker Room Image Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <img src={gymLockers} alt="Gym Lockers" className="w-full rounded-2xl shadow-xl" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                                    Found Something?
                                </h2>
                                <p className="text-lg text-slate-600 mb-6">
                                    If you've found an item in the gym, please report it through our system so the owner can be notified immediately.
                                </p>
                                <button className="btn-primary">
                                    Report Found Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                        Join our gym members using the smart Lost & Found system
                    </p>
                    <button className="px-10 py-4 bg-white text-cyan-600 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all shadow-xl">
                        Create Account
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
