import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Code2, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStudents } from '@/hooks/useStudents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Community = () => {
    const { data: students = [], isLoading } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter community members
    const communityMembers = useMemo(() =>
        students.filter(student => student.inCommunity),
        [students]
    );

    // Filter by search term and sort by points (highest first)
    const filteredMembers = communityMembers
        .filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.roll.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const pointsA = a.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;
            const pointsB = b.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;
            return pointsB - pointsA; // Sort descending (highest points first)
        });

    // Calculate community stats
    const totalPoints = communityMembers.reduce((sum, member) =>
        sum + (member.badges?.reduce((badgeSum, badge) => badgeSum + (badge?.points || 0), 0) || 0), 0
    );

    const totalProjects = communityMembers.reduce((sum, member) =>
        sum + (member.projects?.length || 0), 0
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 w-full gap-5 flex items-center justify-start"
            >
                <Users className="w-8 h-8 mb-2 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold mb-1">🏆 Community</h1>
                    <p className="text-sm text-muted-foreground">Connect with fellow coders and build together</p>
                </div>
            </motion.div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card shadow-card">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{communityMembers.length}</h3>
                                <p className="text-muted-foreground">Members</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-card">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{totalPoints}</h3>
                                <p className="text-muted-foreground">Total Points</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-card">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                                <Code2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{totalProjects}</h3>
                                <p className="text-muted-foreground">Projects Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search community members by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Community Members */}
            <Card className="glass-card shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Community Members ({filteredMembers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                            >
                                <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                </div>
                                <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                            </motion.div>
                        ))
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {searchTerm ? 'No matching members found' : 'Community is growing!'}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to join our amazing coding community!'}
                            </p>
                        </div>
                    ) : (
                        filteredMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={member.avatarUrl ? `${API_BASE_URL}${member.avatarUrl}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{member.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Roll: {member.roll}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {member.badges?.length || 0} badges
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {member.projects?.length || 0} projects
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">
                                        {member.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">points</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Community;