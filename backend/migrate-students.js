#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./src/models/Student');
const { logger } = require('./src/config/logger');

/**
 * Database Migration Script
 * Updates existing student documents with new fields
 * 
 * Run: node migrate-students.js
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Finds all students
 * 3. Adds missing fields with default values
 * 4. Reports changes
 */

async function migrateStudents() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✓ Connected to MongoDB');

        // Get all students
        const students = await Student.find({});
        logger.info(`Found ${students.length} students to update`);

        if (students.length === 0) {
            logger.info('No students found. Nothing to migrate.');
            await mongoose.connection.close();
            return;
        }

        let updated = 0;
        let skipped = 0;

        // Update each student
        for (const student of students) {
            let needsUpdate = false;

            // Check and add missing fields
            if (!student.role) {
                student.role = 'student';
                needsUpdate = true;
            }

            if (student.totalPoints === undefined || student.totalPoints === null) {
                student.totalPoints = 0;
                needsUpdate = true;
            }

            if (!student.username) {
                // Generate username from email if missing
                const emailPrefix = student.email.split('@')[0];
                const randomNum = Math.floor(Math.random() * 10000);
                student.username = `${emailPrefix}_${randomNum}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
                needsUpdate = true;
                logger.warn(`Generated username for ${student.email}: ${student.username}`);
            }

            // Save if changes were made
            if (needsUpdate) {
                try {
                    await student.save();
                    updated++;
                    logger.info(`✓ Updated: ${student.email}`);
                } catch (error) {
                    if (error.code === 11000) {
                        // Duplicate key error - username might already exist
                        logger.warn(`⚠ Duplicate username for ${student.email}, skipping...`);
                        skipped++;
                    } else {
                        logger.error(`✗ Error updating ${student.email}: ${error.message}`);
                        skipped++;
                    }
                }
            } else {
                skipped++;
            }
        }

        // Summary
        logger.info('\n' + '='.repeat(50));
        logger.info('Migration Summary:');
        logger.info(`Total students: ${students.length}`);
        logger.info(`Updated: ${updated}`);
        logger.info(`Skipped: ${skipped}`);
        logger.info('='.repeat(50));

        if (updated > 0) {
            logger.info('✓ Migration completed successfully!');
        } else {
            logger.info('ℹ No updates needed - all students already have new fields');
        }

        await mongoose.connection.close();
        logger.info('✓ MongoDB connection closed');

    } catch (error) {
        logger.error('Migration failed:', error.message);
        process.exit(1);
    }
}

// Run migration
migrateStudents();
