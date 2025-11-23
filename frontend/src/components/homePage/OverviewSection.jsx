const OverviewSection = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Left card */}
                    <div className="glass-card rounded-3xl p-8 animate-scale-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <span className="text-2xl">👍</span>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                <span className="text-2xl">⏱️</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
                        <p className="text-sm text-muted-foreground">
                            Join our vibrant community of developers and innovators
                        </p>
                    </div>

                    {/* Center card - Overview */}
                    <div className="glass-card rounded-3xl p-8 md:col-span-1 animate-scale-in" style={{ animationDelay: "0.1s" }}>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-4">Overview</h2>
                            <div className="flex justify-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-background" />
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-background -ml-3" />
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-background -ml-3" />
                            </div>
                            <p className="text-xs text-muted-foreground">Active Contributors</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold mb-1">370+</div>
                                <div className="text-xs text-muted-foreground">Total Members</div>
                            </div>
                            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold mb-1">75%</div>
                                <div className="text-xs text-muted-foreground">Growth Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Right card */}
                    <div className="glass-card rounded-3xl p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                        <div className="mb-6">
                            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-60" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Ready to Code</h3>
                        <p className="text-sm text-muted-foreground">
                            Access resources and start building amazing projects
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OverviewSection;
