const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Spinning gradient circle */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-20 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-600 border-r-blue-600 animate-spin"></div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">💪</span>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h3>
                <p className="text-slate-600">Please wait a moment</p>
            </div>
        </div>
    );
};

export default Loader;
