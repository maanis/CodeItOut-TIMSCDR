import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Plus, Edit, Trash2, ExternalLink, Github, Clock, CheckCircle, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProjects, createProject, updateProject, deleteProject } from '@/hooks/useProjects';

const Projects = () => {
    const { data: projects = [], isLoading, error, refetch } = useMyProjects();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githublink: '',
        liveLink: '',
        techStack: []
    });
    const [techInput, setTechInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                await updateProject(editingId, formData);
            } else {
                await createProject(formData);
            }
            setIsDialogOpen(false);
            resetForm();
            refetch(); // Refresh the projects list
        } catch (error) {
            // Error is already handled in the hook with toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            githublink: '',
            liveLink: '',
            techStack: []
        });
        setTechInput('');
        setEditingId(null);
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setFormData({
            title: project.title,
            description: project.description,
            githublink: project.githublink,
            liveLink: project.liveLink || '',
            techStack: project.techStack || []
        });
        setTechInput('');
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                refetch(); // Refresh the projects list
            } catch (error) {
                // Error is already handled in the hook with toast
            }
        }
    };

    const openAddDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const addTechStack = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData({
                ...formData,
                techStack: [...formData.techStack, techInput.trim()]
            });
            setTechInput('');
        }
    };

    const removeTechStack = (tech) => {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter(t => t !== tech)
        });
    };

    const handleTechKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechStack();
        }
    };

    const getStatusBadge = (approved) => {
        if (approved) {
            return (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge>
            );
        } else {
            return (
                <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Approval
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <p className="text-muted-foreground">Manage and showcase your coding projects</p>
                </div>
                <Button onClick={openAddDialog} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                </Button>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="glass-card shadow-card">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-16 w-full mb-4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                <Card className="glass-card shadow-card">
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load projects</p>
                        <Button onClick={refetch} variant="outline" className="mt-4">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            ) : projects.length === 0 ? (
                <Card className="glass-card shadow-card">
                    <CardContent className="text-center py-12">
                        <Code2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground mb-6">Start building and showcase your projects here!</p>
                        <Button onClick={openAddDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Project
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="glass-card shadow-card h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                                        {getStatusBadge(project.approved)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.techStack.map((tech) => (
                                                <Badge key={tech} variant="secondary" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(project.githublink, '_blank')}
                                            className="flex items-center gap-1"
                                        >
                                            <Github className="w-3 h-3" />
                                            Code
                                        </Button>
                                        {project.liveLink && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(project.liveLink, '_blank')}
                                                className="flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Live Demo
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(project)}
                                            className="flex-1"
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(project._id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Project Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Project Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter project title"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your project"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="githublink">GitHub Repository Link *</Label>
                            <Input
                                id="githublink"
                                type="url"
                                value={formData.githublink}
                                onChange={(e) => setFormData({ ...formData, githublink: e.target.value })}
                                placeholder="https://github.com/username/repo"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="liveLink">Live Demo Link (Optional)</Label>
                            <Input
                                id="liveLink"
                                type="url"
                                value={formData.liveLink}
                                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                placeholder="https://your-project-demo.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="techStack">Tech Stack</Label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    id="techStack"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={handleTechKeyPress}
                                    placeholder="Add technology (e.g., React, Node.js)"
                                />
                                <Button type="button" onClick={addTechStack} variant="outline">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {formData.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {formData.techStack.map((tech) => (
                                        <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                            {tech}
                                            <X
                                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                                onClick={() => removeTechStack(tech)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Project' : 'Submit Project'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default Projects;