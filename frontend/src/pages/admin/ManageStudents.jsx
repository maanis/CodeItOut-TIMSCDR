import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStudents } from '@/hooks/useStudents';
import { toast } from 'sonner';

const ManageStudents = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [addingToCommunity, setAddingToCommunity] = useState(null);

    const { data: students = [], isLoading, error, refetch } = useStudents();

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredStudents)

    const handleView = (student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    };

    const handleAddToCommunity = async (studentId) => {
        try {
            setAddingToCommunity(studentId);

            const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/add-to-community`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to add student to community');
            }

            toast.success('Student added to community successfully!');
            refetch();
        } catch (error) {
            console.error('Add to community error:', error);
            toast.error('Failed to add student to community');
        } finally {
            setAddingToCommunity(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Students</h1>
                    <p className="text-muted-foreground mt-1">View and manage student profiles</p>
                </div>
                <div className="glass-card rounded-xl p-6">
                    <div className="animate-pulse space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Students</h1>
                    <p className="text-muted-foreground mt-1">View and manage student profiles</p>
                </div>
                <div className="glass-card rounded-xl p-6 text-center">
                    <p className="text-red-500">Failed to load students. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Students</h1>
                <p className="text-muted-foreground mt-1">View and manage student profiles</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Badges</TableHead>
                            <TableHead>Total Points</TableHead>
                            <TableHead>Community Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => {
                            const totalPoints = student.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;
                            return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`${API_BASE_URL}${student.avatarUrl}`} />
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-sm text-muted-foreground">{student.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{student.roll}</Badge>
                                    </TableCell>
                                    <TableCell>{student.badges?.length || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{totalPoints}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.inCommunity ? "default" : "secondary"}>
                                            {student.inCommunity ? "Member" : "Not Member"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleView(student)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                            {!student.inCommunity && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddToCommunity(student.id)}
                                                    disabled={addingToCommunity === student.id}
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    {addingToCommunity === student.id ? 'Adding...' : 'Add to Community'}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={`${API_BASE_URL}${selectedStudent.avatarUrl}`} />
                                    <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                                    <Badge variant="outline" className="mt-1">{selectedStudent.roll}</Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Total Points</h4>
                                    <Badge variant="secondary">
                                        {selectedStudent.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0}
                                    </Badge>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Badges Earned</h4>
                                    <p>{selectedStudent.badges?.length || 0}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Face Recognition</h4>
                                    <Badge variant={selectedStudent.hasFaceEmbeddings ? "default" : "secondary"}>
                                        {selectedStudent.hasFaceEmbeddings ? "Enabled" : "Not Set"}
                                    </Badge>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Member Since</h4>
                                    <p className="text-sm">
                                        {new Date(selectedStudent.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {selectedStudent.badges && selectedStudent.badges.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3">Earned Badges</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {selectedStudent.badges.map((badge, index) => (
                                            badge && (
                                                <div key={badge._id || index} className="flex items-center gap-2 p-2 border rounded-lg">
                                                    <span className="text-lg">{badge.icon}</span>
                                                    <div>
                                                        <p className="text-sm font-medium">{badge.name}</p>
                                                        <p className="text-xs text-muted-foreground">{badge.points} pts</p>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageStudents;