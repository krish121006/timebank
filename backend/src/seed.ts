import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './modules/users/user.model';
import { UserSkill } from './modules/skills/skill.model';

dotenv.config();

const seed = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/timebank';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB Atlas');

    // Clean existing seed users
    await User.deleteMany({ email: { $in: ['rahul@timebank.dev', 'ananya@timebank.dev', 'rohan@timebank.dev', 'admin@timebank.dev'] } });

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Sample Users
    const users = await User.create([
      {
        name: 'Rahul Sharma',
        username: 'rahul_dev',
        email: 'rahul@timebank.dev',
        passwordHash,
        bio: 'Senior Full Stack Developer passionate about React, Node.js, and helping beginners code.',
        timezone: 'Asia/Kolkata',
        timeCredits: 12,
        rating: 4.9,
        completedExchanges: 15,
        isPremium: true
      },
      {
        name: 'Ananya Verma',
        username: 'ananya_ui',
        email: 'ananya@timebank.dev',
        passwordHash,
        bio: 'UI/UX Designer with 4 years experience creating clean Figma designs & mobile app interfaces.',
        timezone: 'Asia/Kolkata',
        timeCredits: 8,
        rating: 4.8,
        completedExchanges: 9,
        isPremium: false
      },
      {
        name: 'Rohan Gupta',
        username: 'rohan_ai',
        email: 'rohan@timebank.dev',
        passwordHash,
        bio: 'Machine Learning practitioner & Python developer. Excited to learn Spanish and Graphic Design!',
        timezone: 'Asia/Kolkata',
        timeCredits: 6,
        rating: 4.7,
        completedExchanges: 6,
        isPremium: false
      },
      {
        name: 'Admin User',
        username: 'admin_master',
        email: 'admin@timebank.dev',
        passwordHash,
        role: 'ADMIN',
        bio: 'Platform Administrator',
        timezone: 'Asia/Kolkata',
        timeCredits: 50,
        rating: 5.0,
        completedExchanges: 25,
        isPremium: true
      }
    ]);

    console.log(`[Seed] Created ${users.length} sample users`);

    // Clean existing seed skills
    await UserSkill.deleteMany({ userId: { $in: users.map(u => u._id) } });

    // 2. Create Skills
    const skills = await UserSkill.create([
      {
        userId: users[0]._id,
        skillName: 'React & TypeScript Mentorship',
        description: '1-on-1 practical guidance on building scalable React components and TypeScript state management.',
        category: 'Web Development',
        proficiency: 'EXPERT',
        mode: 'TEACH',
        availabilityDays: ['Saturday', 'Sunday']
      },
      {
        userId: users[0]._id,
        skillName: 'Spanish Language Conversation',
        description: 'Looking for a native speaker to practice basic conversational Spanish once a week.',
        category: 'Languages',
        proficiency: 'BEGINNER',
        mode: 'LEARN',
        availabilityDays: ['Friday', 'Saturday']
      },
      {
        userId: users[1]._id,
        skillName: 'Figma UI/UX Design & Prototyping',
        description: 'Learn wireframing, component design systems, and auto-layout in Figma.',
        category: 'Design & UI/UX',
        proficiency: 'ADVANCED',
        mode: 'TEACH',
        availabilityDays: ['Monday', 'Wednesday']
      },
      {
        userId: users[2]._id,
        skillName: 'Python for Data Analysis & ML',
        description: 'Introduction to Pandas, NumPy, and Scikit-Learn with real dataset projects.',
        category: 'Data Science & AI',
        proficiency: 'EXPERT',
        mode: 'TEACH',
        availabilityDays: ['Saturday', 'Sunday']
      }
    ]);

    console.log(`[Seed] Created ${skills.length} sample skills`);
    console.log('[Seed] Database populated successfully with mock data!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seed();
