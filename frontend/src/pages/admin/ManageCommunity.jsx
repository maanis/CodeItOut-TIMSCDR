import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserMinus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/useStudents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageCommunity = () => {
    const { data: students = [], isLoading, refetch } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');
    const [removingUser, setRemovingUser] = useState(null);

    // Filter community members
    const communityMembers = students.filter(student => student.inCommunity);

    // Filter by search term and sort by points (highest first)
    const filteredMembers = communityMembers
        .filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const pointsA = a.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;
            const pointsB = b.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;
            return pointsB - pointsA; // Sort descending (highest points first)
        });

    const handleRemoveFromCommunity = async (studentId) => {
        try {
            setRemovingUser(studentId);

            const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/remove-from-community`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove student from community');
            }

            toast.success('Student removed from community successfully!');
            refetch();
        } catch (error) {
            console.error('Remove from community error:', error);
            toast.error('Failed to remove student from community');
        } finally {
            setRemovingUser(null);
        }
    };

    const handleRefresh = () => {
        refetch();
        toast.success('Community data refreshed!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Community</h1>
                    <p className="text-muted-foreground mt-1">Manage community members and their access</p>
                </div>
                <Button className="gradient-primary text-white" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Card */}
            <Card className="glass-card shadow-card">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{communityMembers.length}</h3>
                            <p className="text-muted-foreground">Community Members</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search community members by name, roll, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Community Members */}
            <div className="grid gap-4">
                {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-muted animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                </div>
                                <div className="w-24 h-10 bg-muted rounded animate-pulse"></div>
                            </div>
                        </motion.div>
                    ))
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchTerm ? 'No matching members found' : 'No community members yet'}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they join the community'}
                        </p>
                    </div>
                ) : (
                    filteredMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={member.avatarUrl ? `${API_BASE_URL}${member.avatarUrl}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Roll: {member.roll}</span>
                                        <span>{member.email}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {member.badges?.length || 0} badges
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveFromCommunity(member.id)}
                                    disabled={removingUser === member.id}
                                    className="flex items-center gap-2"
                                >
                                    <UserMinus className="w-4 h-4" />
                                    {removingUser === member.id ? 'Removing...' : 'Remove'}
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageCommunity;