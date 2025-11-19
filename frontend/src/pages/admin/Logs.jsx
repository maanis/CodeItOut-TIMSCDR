import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Filter, Search, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');

    const token = localStorage.getItem('token');

    // Fetch logs
    const fetchLogs = async (page = 1, filters = {}) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page,
                limit: pageSize,
                ...filters
            });

            console.log('Fetching logs from:', `${API_BASE_URL}/logs?${params}`);
            const response = await fetch(`${API_BASE_URL}/logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Logs data received:', data);
            setLogs(data.logs || []);
            setTotalPages(data.pagination.pages || 1);
            setCurrentPage(page);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setError(err.message);
            toast.error('Failed to load logs: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logs/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    // Initial load
    useEffect(() => {
        if (token) {
            fetchLogs(1);
            fetchStats();
        }
    }, [token]);

    // Handle filter changes
    const handleFilterChange = () => {
        const filters = {};
        if (search) filters.search = search;
        if (statusFilter !== 'all') filters.statusCode = statusFilter;
        if (levelFilter !== 'all') filters.level = levelFilter;

        setCurrentPage(1);
        fetchLogs(1, filters);
    };

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        const filters = {};
        if (search) filters.search = search;
        if (statusFilter !== 'all') filters.statusCode = statusFilter;
        if (levelFilter !== 'all') filters.level = levelFilter;

        await fetchLogs(currentPage, filters);
        await fetchStats();
        setIsRefreshing(false);
        toast.success('Logs refreshed');
    };

    // Handle pagination
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            const filters = {};
            if (search) filters.search = search;
            if (statusFilter !== 'all') filters.statusCode = statusFilter;
            if (levelFilter !== 'all') filters.level = levelFilter;

            fetchLogs(page, filters);
        }
    };

    // Get status badge
    const getStatusBadge = (statusCode) => {
        if (!statusCode) return null;
        if (statusCode >= 200 && statusCode < 300) {
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> {statusCode}</Badge>;
        } else if (statusCode >= 400 && statusCode < 500) {
            return <Badge className="bg-yellow-500 hover:bg-yellow-600"><AlertTriangle className="w-3 h-3 mr-1" /> {statusCode}</Badge>;
        } else if (statusCode >= 500) {
            return <Badge className="bg-red-500 hover:bg-red-600"><AlertCircle className="w-3 h-3 mr-1" /> {statusCode}</Badge>;
        }
    };

    // Get level badge
    const getLevelBadge = (level) => {
        const levelColors = {
            debug: 'bg-gray-500',
            info: 'bg-blue-500',
            warn: 'bg-yellow-500',
            error: 'bg-red-500',
            fatal: 'bg-red-700'
        };
        return <Badge className={`${levelColors[level] || 'bg-gray-500'} hover:opacity-80`}>{level.toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">API Logs</h1>
                    <p className="text-muted-foreground mt-1">Monitor all API requests and responses</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                    variant="outline"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="glass-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Total Requests</div>
                            <div className="text-2xl font-bold mt-2">{stats.totalLogs}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" /> Success (2xx-3xx)
                            </div>
                            <div className="text-2xl font-bold mt-2 text-green-500">{stats.successCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" /> Client Errors (4xx)
                            </div>
                            <div className="text-2xl font-bold mt-2 text-yellow-500">{stats.clientErrorCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="w-4 h-4 text-red-500" /> Server Errors (5xx)
                            </div>
                            <div className="text-2xl font-bold mt-2 text-red-500">{stats.serverErrorCount}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    placeholder="Search logs (URL, method, error)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                    className="glass-card"
                />
                <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                }}>
                    <SelectTrigger className="glass-card">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status Codes</SelectItem>
                        <SelectItem value="200">Success (2xx-3xx)</SelectItem>
                        <SelectItem value="400">Client Error (4xx)</SelectItem>
                        <SelectItem value="500">Server Error (5xx)</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={(value) => {
                    setLevelFilter(value);
                    handleFilterChange();
                }}>
                    <SelectTrigger className="glass-card">
                        <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warn</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="fatal">Fatal</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleFilterChange} className="flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Apply Filters
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="glass-card border-red-500/50 bg-red-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-500 font-semibold">Error loading logs</p>
                                <p className="text-red-500/80 text-sm mt-1">{error}</p>
                                <p className="text-muted-foreground text-xs mt-2">Check browser console for more details</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logs Table */}
            <Card className="glass-card overflow-hidden">
                <CardHeader className="border-b">
                    <CardTitle>Request Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No logs found matching your filters
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                                        <th className="px-4 py-3 text-left font-semibold">Method</th>
                                        <th className="px-4 py-3 text-left font-semibold">URL</th>
                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold">Level</th>
                                        <th className="px-4 py-3 text-left font-semibold">Response Time</th>
                                        <th className="px-4 py-3 text-left font-semibold">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="border-b hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-semibold text-blue-500">
                                                {log.method || '-'}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate" title={log.url}>
                                                {log.url || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(log.statusCode)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getLevelBadge(log.level)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.responseTime ? `${log.responseTime}ms` : '-'}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate text-muted-foreground" title={log.message || log.error}>
                                                {log.message || log.error || '-'}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && logs.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span> ({logs.length} logs)
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;
