import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents, createEvent, updateEvent, deleteEvent } from '@/hooks/useEvents';

const ManageEvents = () => {
    const { data: events = [], isLoading, error, refetch } = useEvents();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'Upcoming' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                await updateEvent(editingId, formData);
            } else {
                await createEvent(formData);
            }
            setIsDialogOpen(false);
            setFormData({ title: '', description: '', status: 'Upcoming' });
            setEditingId(null);
            refetch(); // Refresh the events list
        } catch (error) {
            // Error is already handled in the hook with toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (event) => {
        setEditingId(event._id);
        setFormData({ title: event.title, description: event.description, status: event.status });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
                refetch(); // Refresh the events list
            } catch (error) {
                // Error is already handled in the hook with toast
            }
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', status: 'Upcoming' });
        setIsDialogOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-500';
            case 'Ongoing': return 'bg-green-500';
            case 'Completed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Events</h1>
                    <p className="text-muted-foreground mt-1">Create and manage club events</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary text-white" onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'Create'} Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                className="w-full gradient-primary text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    // Skeleton loaders
                    Array.from({ length: 3 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-6 w-1/2" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">Error loading events: {error.message}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No events found.</p>
                        <Button
                            onClick={openCreateDialog}
                            className="mt-4 gradient-primary text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Event
                        </Button>
                    </div>
                ) : (
                    events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{event.title}</h3>
                                        <Badge className={`${getStatusColor(event.status)} text-white`}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mb-3">{event.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Created: {new Date(event.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(event)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageEvents;