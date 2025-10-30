import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, ExternalLink, Github, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useProjects, approveProject } from '@/hooks/useProjects';

const ManageProjects = () => {
    //     const [projects, setProjects] = useState([
    //     {
    //         id: '1',
    //         title: 'E-commerce Platform',
    //         student: 'John Doe',
    //         description: 'A full-stack e-commerce platform with React and Node.js',
    //         submittedDate: '2024-01-20',
    //         status: 'pending',
    //         techStack: ['React', 'Node.js', 'MongoDB']
    //     },
    //     {
    //         id: '2',
    //         title: 'AI Chatbot',
    //         student: 'Jane Smith',
    //         description: 'Intelligent chatbot using OpenAI API',
    //         submittedDate: '2024-01-22',
    //         status: 'pending',
    //         techStack: ['Python', 'FastAPI', 'OpenAI']
    //     },
    // ]);

    const { data: projects = [], isLoading, error, refetch } = useProjects();
    console.log(projects, error)
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(null);

    const handleApprove = async (id, approved) => {
        setIsApproving(id);
        try {
            await approveProject(id, approved);
            refetch(); // Refresh the projects list
        } catch (error) {
            // Error is already handled in the hook with toast
        } finally {
            setIsApproving(null);
        }
    };

    const handleView = (project) => {
        setSelectedProject(project);
        setIsDialogOpen(true);
    };

    const getStatusBadge = (approved) => {
        if (approved) {
            return (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Approved
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Pending Review
                </Badge>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Project Review Panel</h1>
                    <p className="text-muted-foreground mt-1">Review and approve student project submissions</p>
                </div>
                <Button onClick={refetch} variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="glass-card p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                <Card className="glass-card">
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load projects</p>
                        <Button onClick={refetch} variant="outline" className="mt-4">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            ) : projects.length === 0 ? (
                <Card className="glass-card">
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No projects submitted yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {projects?.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{project?.title}</h3>
                                        {getStatusBadge(project?.approved)}
                                    </div>
                                    <p className="text-muted-foreground mb-2">
                                        By {project?.student?.name} ({project?.student?.roll})
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {project?.description}
                                    </p>

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.techStack.map((tech) => (
                                                <Badge key={tech} variant="outline" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mb-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(project.githublink, '_blank')}
                                            className="flex items-center gap-1"
                                        >
                                            <Github className="w-3 h-3" />
                                            View Code
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

                                    <p className="text-sm text-muted-foreground">
                                        Submitted: {new Date(project.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleView(project)}
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    {!project.approved && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                                onClick={() => handleApprove(project._id, true)}
                                                disabled={isApproving === project._id}
                                                title="Approve Project"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleApprove(project._id, false)}
                                                disabled={isApproving === project._id}
                                                title="Reject Project"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Project Details</DialogTitle>
                    </DialogHeader>
                    {selectedProject && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-muted-foreground">
                                        By {selectedProject.student.name} ({selectedProject.student.roll})
                                    </p>
                                    {getStatusBadge(selectedProject.approved)}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-muted-foreground">{selectedProject.description}</p>
                            </div>

                            {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedProject.techStack.map((tech) => (
                                            <Badge key={tech} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold mb-2">Links</h4>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(selectedProject.githublink, '_blank')}
                                        className="flex items-center gap-1"
                                    >
                                        <Github className="w-3 h-3" />
                                        GitHub Repository
                                    </Button>
                                    {selectedProject.liveLink && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(selectedProject.liveLink, '_blank')}
                                            className="flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Live Demo
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Submission Details</h4>
                                <p className="text-sm text-muted-foreground">
                                    Submitted on {new Date(selectedProject.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(selectedProject.createdAt).toLocaleTimeString()}
                                </p>
                            </div>

                            {!selectedProject.approved && (
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        onClick={() => {
                                            handleApprove(selectedProject._id, true);
                                            setIsDialogOpen(false);
                                        }}
                                        disabled={isApproving === selectedProject._id}
                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve Project
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleApprove(selectedProject._id, false);
                                            setIsDialogOpen(false);
                                        }}
                                        disabled={isApproving === selectedProject._id}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject Project
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageProjects;


//         switch (status) {
//             case 'pending': return 'bg-yellow-500';
//             case 'approved': return 'bg-green-500';
//             case 'rejected': return 'bg-red-500';
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-3xl font-bold">Project Review Panel</h1>
//                 <p className="text-muted-foreground mt-1">Review and approve student projects</p>
//             </div>

//             <div className="grid gap-4">
//                 {projects.map((project, index) => (
//                     <motion.div
//                         key={project.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="glass-card p-6 rounded-xl"
//                     >
//                         <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                                 <div className="flex items-center gap-3 mb-2">
//                                     <h3 className="text-xl font-bold">{project.title}</h3>
//                                     <Badge className={`${getStatusColor(project.status)} text-white`}>
//                                         {project.status}
//                                     </Badge>
//                                 </div>
//                                 <p className="text-muted-foreground mb-2">By {project.student}</p>
//                                 <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {project.techStack.map((tech) => (
//                                         <Badge key={tech} variant="secondary">{tech}</Badge>
//                                     ))}
//                                 </div>
//                                 <p className="text-sm text-muted-foreground mt-3">
//                                     Submitted: {new Date(project.submittedDate).toLocaleDateString()}
//                                 </p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => handleView(project)}
//                                 >
//                                     <Eye className="w-4 h-4" />
//                                 </Button>
//                                 {project.status === 'pending' && (
//                                     <>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="text-green-500 hover:text-green-600"
//                                             onClick={() => handleApprove(project.id)}
//                                         >
//                                             <Check className="w-4 h-4" />
//                                         </Button>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="text-red-500 hover:text-red-600"
//                                             onClick={() => handleReject(project.id)}
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </Button>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Project Details</DialogTitle>
//                     </DialogHeader>
//                     {selectedProject && (
//                         <div className="space-y-4">
//                             <div>
//                                 <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
//                                 <p className="text-muted-foreground">By {selectedProject.student}</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold mb-2">Description</h4>
//                                 <p className="text-muted-foreground">{selectedProject.description}</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold mb-2">Tech Stack</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {selectedProject.techStack.map((tech) => (
//                                         <Badge key={tech} variant="secondary">{tech}</Badge>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold mb-2">Status</h4>
//                                 <Badge className={`${getStatusColor(selectedProject.status)} text-white`}>
//                                     {selectedProject.status}
//                                 </Badge>
//                             </div>
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ManageProjects;