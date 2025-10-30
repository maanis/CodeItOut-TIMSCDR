require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('./src/models/Badge');
const connectDB = require('./src/config/db');

const badgeIcons = [
    { name: 'Code Warrior', icon: '⚔️', points: 100 },
    { name: 'Bug Hunter', icon: '🐛', points: 80 },
    { name: 'Team Player', icon: '🤝', points: 60 },
    { name: 'Quick Learner', icon: '⚡', points: 50 },
    { name: 'Master Coder', icon: '👑', points: 120 },
    { name: 'Innovator', icon: '💡', points: 90 },
    { name: 'Creative Genius', icon: '🎨', points: 70 },
    { name: 'Diamond Mind', icon: '💎', points: 110 },
    { name: 'Launch Master', icon: '🚀', points: 100 },
    { name: 'Think Tank', icon: '🧠', points: 90 },
    { name: 'On Fire', icon: '🔥', points: 100 },
    { name: 'Growth Hacker', icon: '📈', points: 80 },
    { name: 'Goal Setter', icon: '🎯', points: 70 },
    { name: 'Star Performer', icon: '🌟', points: 120 },
    { name: 'Green Thumb', icon: '🌱', points: 60 },
    { name: 'Code Ninja', icon: '👨‍💻', points: 100 },
    { name: 'Public Speaker', icon: '🎤', points: 90 },
    { name: 'Gamer', icon: '🎮', points: 50 },
    { name: 'Focus Mode', icon: '🎧', points: 70 },
    { name: 'Bookworm', icon: '📚', points: 60 },
    { name: 'Cinematic Vision', icon: '🎬', points: 80 },
    { name: 'Gold Medalist', icon: '🥇', points: 150 },
    { name: 'Puzzle Solver', icon: '🧩', points: 80 },
    { name: 'Risk Taker', icon: '🎲', points: 60 },
    { name: 'Professional', icon: '💼', points: 90 },
    { name: 'Fixer', icon: '🔧', points: 70 },
    { name: 'Photographer', icon: '📸', points: 80 }
];

const seedBadges = async () => {
    try {
        await connectDB();

        console.log('🌱 Seeding badge icons...');

        for (const badgeIcon of badgeIcons) {
            const existingBadge = await Badge.findOne({ icon: badgeIcon.icon });

            if (!existingBadge) {
                const badge = new Badge({
                    name: badgeIcon.name,
                    icon: badgeIcon.icon,
                    points: badgeIcon.points,
                    description: `Awarded for being a ${badgeIcon.name.toLowerCase()}`
                });

                await badge.save();
                console.log(`✅ Created badge: ${badgeIcon.name}`);
            } else {
                console.log(`⏭️  Badge already exists: ${badgeIcon.name}`);
            }
        }

        console.log('🎉 Badge seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding badges:', error);
        process.exit(1);
    }
};

seedBadges();