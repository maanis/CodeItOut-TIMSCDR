import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Award, Users, Search, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBadges, useCreateBadge, useUpdateBadge, useDeleteBadge, useAssignBadge, useRemoveBadge } from '@/hooks/useBadges';
import { useStudents } from '@/hooks/useStudents';

const ManageBadges = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        points: '',
        description: ''
    });

    // Predefined badge icons
    const badgeIcons = [
        { icon: '🎨', name: 'Creative Genius' },
        { icon: '💎', name: 'Diamond Mind' },
        { icon: '🚀', name: 'Launch Master' },
        { icon: '🧠', name: 'Think Tank' },
        { icon: '🔥', name: 'On Fire' },
        { icon: '📈', name: 'Growth Hacker' },
        { icon: '🎯', name: 'Goal Setter' },
        { icon: '🌟', name: 'Star Performer' },
        { icon: '🌱', name: 'Green Thumb' },
        { icon: '👨‍💻', name: 'Code Ninja' },
        { icon: '🎤', name: 'Public Speaker' },
        { icon: '🎮', name: 'Gamer' },
        { icon: '🎧', name: 'Focus Mode' },
        { icon: '📚', name: 'Bookworm' },
        { icon: '🎬', name: 'Cinematic Vision' },
        { icon: '🥇', name: 'Gold Medalist' },
        { icon: '🧩', name: 'Puzzle Solver' },
        { icon: '🎲', name: 'Risk Taker' },
        { icon: '💼', name: 'Professional' },
        { icon: '🔧', name: 'Fixer' },
        { icon: '📸', name: 'Photographer' }
    ];

    const { data: badges = [], isLoading, error } = useBadges();
    const { data: students = [], isLoading: studentsLoading, error: studentsError } = useStudents();
    const createBadgeMutation = useCreateBadge();
    const updateBadgeMutation = useUpdateBadge();
    const deleteBadgeMutation = useDeleteBadge();
    const assignBadgeMutation = useAssignBadge();
    const removeBadgeMutation = useRemoveBadge();

    const filteredBadges = badges.filter(badge =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateBadge = async (e) => {
        e.preventDefault();
        try {
            await createBadgeMutation.mutateAsync({
                name: formData.name,
                icon: formData.icon,
                points: parseInt(formData.points),
                description: formData.description
            });
            setIsCreateDialogOpen(false);
            setFormData({ name: '', icon: '', points: '', description: '' });
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleEditBadge = async (e) => {
        e.preventDefault();
        try {
            await updateBadgeMutation.mutateAsync({
                id: selectedBadge._id,
                data: {
                    name: formData.name,
                    icon: formData.icon,
                    points: parseInt(formData.points),
                    description: formData.description
                }
            });
            setIsEditDialogOpen(false);
            setSelectedBadge(null);
            setFormData({ name: '', icon: '', points: '', description: '' });
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleDeleteBadge = async (badgeId) => {
        if (window.confirm('Are you sure you want to delete this badge? This will remove it from all students.')) {
            try {
                await deleteBadgeMutation.mutateAsync(badgeId);
            } catch (error) {
                // Error handled by mutation
            }
        }
    };

    const handleAssignBadge = async (studentId) => {
        try {
            await assignBadgeMutation.mutateAsync({
                badgeId: selectedBadge._id,
                studentId
            });
            setIsAssignDialogOpen(false);
            setSelectedBadge(null);
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleRemoveBadge = async (badgeId, studentId) => {
        try {
            await removeBadgeMutation.mutateAsync({
                badgeId,
                studentId
            });
        } catch (error) {
            // Error handled by mutation
        }
    };

    const openEditDialog = (badge) => {
        setSelectedBadge(badge);
        setFormData({
            name: badge.name,
            icon: badge.icon,
            points: badge.points.toString(),
            description: badge.description || ''
        });
        setIsEditDialogOpen(true);
    };

    const openAssignDialog = (badge) => {
        setSelectedBadge(badge);
        setIsAssignDialogOpen(true);
    };

    if (isLoading || studentsLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-48 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-64"></div>
                </div>
                <div className="glass-card rounded-xl p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || studentsError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Badges</h1>
                    <p className="text-muted-foreground mt-1">Create and manage achievement badges</p>
                </div>
                <div className="glass-card rounded-xl p-6 text-center">
                    <p className="text-red-500">
                        {error ? 'Failed to load badges.' : 'Failed to load students.'} Please try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage Badges</h1>
                    <p className="text-muted-foreground mt-1">Create and manage achievement badges</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Badge
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Badge</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateBadge} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Badge Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Code Warrior"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="icon">Choose Icon</Label>
                                <div className="grid grid-cols-6 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                                    {badgeIcons.map((badgeIcon) => (
                                        <button
                                            key={badgeIcon.icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: badgeIcon.icon })}
                                            className={`p-2 rounded-lg border-2 transition-all hover:scale-110 ${formData.icon === badgeIcon.icon
                                                ? 'border-primary bg-primary/10'
                                                : 'border-muted hover:border-primary/50'
                                                }`}
                                            title={badgeIcon.name}
                                        >
                                            <span className="text-2xl">{badgeIcon.icon}</span>
                                        </button>
                                    ))}
                                </div>
                                {formData.icon && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Selected: {badgeIcons.find(b => b.icon === formData.icon)?.name || 'Custom Icon'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                    placeholder="e.g., 100"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what this badge represents..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={createBadgeMutation.isPending}>
                                    {createBadgeMutation.isPending ? 'Creating...' : 'Create Badge'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search badges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBadges.map((badge) => (
                    <motion.div
                        key={badge._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className='h-12 w-12 flex items-center justify-center text-2xl'>{badge.icon}</div>
                                <div>
                                    <h3 className="font-bold text-lg">{badge.name}</h3>
                                    <p className="text-sm text-muted-foreground">{badge.points} points</p>
                                </div>
                            </div>
                        </div>

                        {badge.description && (
                            <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(badge)}
                                className="flex-1"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAssignDialog(badge)}
                                className="flex-1"
                            >
                                <Users className="w-4 h-4 mr-1" />
                                Assign
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBadge(badge._id)}
                                disabled={deleteBadgeMutation.isPending}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredBadges.length === 0 && (
                <div className="glass-card rounded-xl p-12 text-center">
                    <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No badges found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Create your first badge to get started.'}
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Badge
                        </Button>
                    )}
                </div>
            )}

            {/* Edit Badge Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Badge</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditBadge} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Badge Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-icon">Choose Icon</Label>
                            <div className="grid grid-cols-6 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                                {badgeIcons.map((badgeIcon) => (
                                    <button
                                        key={badgeIcon.icon}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: badgeIcon.icon })}
                                        className={`p-2 rounded-lg border-2 transition-all hover:scale-110 ${formData.icon === badgeIcon.icon
                                            ? 'border-primary bg-primary/10'
                                            : 'border-muted hover:border-primary/50'
                                            }`}
                                        title={badgeIcon.name}
                                    >
                                        <span className="text-2xl">{badgeIcon.icon}</span>
                                    </button>
                                ))}
                            </div>
                            {formData.icon && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Selected: {badgeIcons.find(b => b.icon === formData.icon)?.name || 'Custom Icon'}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-points">Points</Label>
                            <Input
                                id="edit-points"
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={updateBadgeMutation.isPending}>
                                {updateBadgeMutation.isPending ? 'Updating...' : 'Update Badge'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign Badge Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Assign Badge: {selectedBadge?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="glass-card rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Badge Details</h4>
                            <div className="flex items-center gap-3">
                                <div className='h-12 w-12 flex items-center justify-center text-2xl'>{selectedBadge?.icon}</div>
                                <div>
                                    <p className="font-medium">{selectedBadge?.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedBadge?.points} points</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Select Students to Assign Badge</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {students?.map((student) => {
                                    const hasBadge = student.badges?.some(badge => badge && badge._id === selectedBadge?._id);
                                    return (
                                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={student.avatarUrl} />
                                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-sm text-muted-foreground">{student.roll}</p>
                                                </div>
                                            </div>
                                            {hasBadge ? (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveBadge(selectedBadge._id, student.id)}
                                                    disabled={removeBadgeMutation.isPending}
                                                >
                                                    <UserMinus className="w-4 h-4 mr-1" />
                                                    Remove
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAssignBadge(student.id)}
                                                    disabled={assignBadgeMutation.isPending}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Assign
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageBadges;