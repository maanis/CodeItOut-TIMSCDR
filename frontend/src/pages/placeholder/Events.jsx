import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents } from '@/hooks/useEvents';

const Events = () => {
    const { data: events = [], isLoading, error } = useEvents();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Upcoming':
                return (
                    <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                    </Badge>
                );
            case 'Ongoing':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        Ongoing
                    </Badge>
                );
            case 'Completed':
                return (
                    <Badge variant="outline" className="border-gray-500 text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        Completed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="mb-4 w-full gap-5 flex items-center justify-start">
                <Calendar className="w-8 h-8 mb-2 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold mb-1">Events</h1>
                    <p className="text-sm text-muted-foreground">Stay updated with upcoming events and activities</p>
                </div>
            </div>

            {/* Events Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card shadow-card p-6 rounded-xl h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : error ? (
                <Card className="glass-card shadow-card">
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load events</p>
                        <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
                    </CardContent>
                </Card>
            ) : events.length === 0 ? (
                <Card className="glass-card shadow-card">
                    <CardContent className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                        <p className="text-muted-foreground">Check back later for upcoming events!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="glass-card shadow-card h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                                        {getStatusBadge(event.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.createdAt).toLocaleDateString()}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>Event</span>
                                        </div>
                                        <span className="font-medium">
                                            Status: {event.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Events;