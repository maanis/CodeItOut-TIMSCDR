import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/hooks/useAnnouncements';

const ManageAnnouncements = () => {
    const { data: announcements = [], isLoading, error, refetch } = useAnnouncements();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                await updateAnnouncement(editingId, formData);
            } else {
                await createAnnouncement(formData);
            }
            setIsDialogOpen(false);
            setFormData({ title: '', content: '' });
            setEditingId(null);
            refetch(); // Refresh the announcements list
        } catch (error) {
            // Error is already handled in the hook with toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (announcement) => {
        setEditingId(announcement._id);
        setFormData({ title: announcement.title, content: announcement.content });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteAnnouncement(id);
                refetch(); // Refresh the announcements list
            } catch (error) {
                // Error is already handled in the hook with toast
            }
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setFormData({ title: '', content: '' });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Announcements</h1>
                    <p className="text-muted-foreground mt-1">Create and manage club announcements</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary text-white" onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'Create'} Announcement</DialogTitle>
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
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
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
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
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
                        <p className="text-red-500">Error loading announcements: {error.message}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No announcements found.</p>
                        <Button
                            onClick={openCreateDialog}
                            className="mt-4 gradient-primary text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Announcement
                        </Button>
                    </div>
                ) : (
                    announcements.map((announcement, index) => (
                        <motion.div
                            key={announcement._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                                    <p className="text-muted-foreground mb-3">{announcement.content}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(announcement)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(announcement._id)}
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

export default ManageAnnouncements;