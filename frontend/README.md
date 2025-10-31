# CodeItOut Frontend

A modern, responsive React frontend for the CodeItOut educational platform. Built with Vite, TypeScript, and Tailwind CSS, featuring a comprehensive admin dashboard and student interface for managing contests, projects, events, and more.

## 🚀 Features

### Student Features
- **Dashboard**: Personalized dashboard with quick access to contests and progress
- **Contest System**: Browse available contests, join waiting rooms, take quizzes, and view results
- **Project Management**: View assigned projects and track progress
- **Event Calendar**: Browse upcoming educational events
- **Leaderboard**: View rankings and achievements
- **Community**: Connect with other students
- **Settings**: Manage profile and preferences

### Admin Features
- **Dashboard**: Comprehensive admin overview with statistics and quick actions
- **Contest Management**: Create and manage quiz contests with AI-powered question generation
- **Student Management**: View, edit, and manage student profiles
- **Project Management**: Assign and track student projects
- **Event Management**: Schedule and manage educational events
- **Announcement System**: Broadcast important notices to students
- **Badge System**: Create and manage achievement badges
- **Analytics**: View detailed analytics and reports

### Technical Features
- **AI-Powered Question Generation**: Generate quiz questions using Google Gemini AI
- **Real-time Updates**: Live contest status and notifications
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Form Validation**: Comprehensive form validation with error handling
- **File Upload**: Secure file upload functionality
- **Data Visualization**: Charts and graphs for analytics

## 🛠 Tech Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM 6.30.1
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion 12.23.24
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React 0.462.0
- **Notifications**: Sonner for toast notifications
- **Theme**: next-themes for dark/light mode

## 📁 Project Structure

```
frontend/
├── public/
│   └── robots.txt                 # SEO and crawler configuration
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── StatCard.jsx      # Reusable stat card component
│   │   ├── layout/
│   │   │   ├── AdminDashboardLayout.jsx  # Admin layout wrapper
│   │   │   ├── AdminSidebar.jsx          # Admin navigation sidebar
│   │   │   ├── DashboardLayout.jsx       # Student layout wrapper
│   │   │   ├── Navbar.jsx                # Top navigation bar
│   │   │   └── Sidebar.jsx               # Student navigation sidebar
│   │   └── ui/                          # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── form.jsx
│   │       ├── input.jsx
│   │       ├── table.jsx
│   │       └── ... (40+ UI components)
│   ├── contexts/
│   │   ├── AuthContext.jsx              # Authentication state management
│   │   ├── MobileMenuContext.jsx        # Mobile menu state
│   │   └── ThemeContext.jsx             # Theme state management
│   ├── hooks/
│   │   ├── use-mobile.tsx               # Mobile detection hook
│   │   ├── use-toast.ts                 # Toast notification hook
│   │   ├── useAnnouncements.js          # Announcements API hook
│   │   ├── useBadges.js                 # Badges API hook
│   │   ├── useContests.js               # Contests API hook
│   │   ├── useEvents.js                 # Events API hook
│   │   ├── useNotifications.js          # Notifications API hook
│   │   ├── useProjects.js               # Projects API hook
│   │   └── useStudents.js               # Students API hook
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   ├── pages/
│   │   ├── admin/                       # Admin pages
│   │   │   ├── AdminContestResults.jsx  # Admin contest results view
│   │   │   ├── AdminDashboard.jsx       # Admin dashboard
│   │   │   ├── ManageAnnouncements.jsx  # Announcement management
│   │   │   ├── ManageBadges.jsx         # Badge management
│   │   │   ├── ManageCommunity.jsx      # Community management
│   │   │   ├── ManageContests.jsx       # Contest management with AI
│   │   │   ├── ManageEvents.jsx         # Event management
│   │   │   ├── ManageLeaderboard.jsx    # Leaderboard management
│   │   │   ├── ManageProjects.jsx       # Project management
│   │   │   └── ManageStudents.jsx       # Student management
│   │   ├── placeholder/                 # Placeholder pages
│   │   │   ├── Community.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Settings.jsx
│   │   ├── ContestResults.jsx           # Contest results page
│   │   ├── ContestWaitingRoom.jsx       # Contest waiting room
│   │   ├── Dashboard.jsx                # Student dashboard
│   │   ├── Login.jsx                    # Login page
│   │   ├── NotFound.jsx                 # 404 page
│   │   ├── Register.jsx                 # Registration page
│   │   ├── StudentContests.jsx          # Student contests list
│   │   ├── StudentDashboard.jsx         # Student dashboard
│   │   └── TakeContest.jsx              # Quiz taking interface
│   ├── App.jsx                          # Main app component with routing
│   ├── index.css                        # Global styles and Tailwind imports
│   └── main.jsx                         # App entry point
├── .env.example                         # Environment variables template
├── components.json                      # shadcn/ui configuration
├── eslint.config.js                    # ESLint configuration
├── index.html                          # HTML template
├── package.json                        # Dependencies and scripts
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── tsconfig.app.json                   # TypeScript app config
├── tsconfig.json                       # TypeScript base config
├── tsconfig.node.json                  # TypeScript Node config
└── vite.config.ts                      # Vite configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

### 3. Environment Configuration
Copy the environment template and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Gemini AI API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Base URL
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
# Using npm
npm run dev

# Using bun
bun run dev
```

The application will be available at `http://localhost:8080`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Using bun
bun run dev          # Start development server
bun run build        # Build for production
bun run lint         # Run ESLint
```

## 🎨 UI Components

The project uses shadcn/ui components built on Radix UI primitives. All components are located in `src/components/ui/` and include:

- **Form Components**: Input, Textarea, Select, Checkbox, Radio Group
- **Layout Components**: Card, Dialog, Sheet, Tabs, Accordion
- **Feedback Components**: Alert, Toast, Progress, Skeleton
- **Navigation Components**: Navigation Menu, Breadcrumb, Pagination
- **Data Display**: Table, Badge, Avatar, Calendar
- **Overlay Components**: Popover, Tooltip, Hover Card

## 🔗 API Integration

The frontend integrates with the backend API using custom React hooks powered by TanStack Query:

- `useAuth()` - Authentication state
- `useContests()` - Contest management
- `useStudents()` - Student data
- `useProjects()` - Project management
- `useEvents()` - Event management
- `useAnnouncements()` - Announcement system
- `useBadges()` - Badge system
- `useNotifications()` - Notification system

## 🎯 Key Features Implementation

### AI-Powered Question Generation
- Integrated Google Gemini AI for automatic quiz question creation
- Keyword-based prompt engineering
- Difficulty level selection (easy, medium, hard)
- JSON response parsing and validation

### Contest System
- Real-time contest status updates
- Waiting room functionality
- Timed quiz interface
- Automatic scoring and results calculation
- Leaderboard generation

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance

### Theme System
- Dark and light mode support
- System preference detection
- Smooth theme transitions
- Consistent theming across all components

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure these environment variables are set in your deployment platform:

```env
VITE_GEMINI_API_KEY=your_production_gemini_api_key
VITE_API_URL=https://your-api-domain.com/api
```

### Deployment Platforms
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `dist` folder or connect via Git
- **Railway**: Deploy directly from GitHub
- **Docker**: Use the included Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new components
- Follow the existing component structure
- Use the provided UI components from shadcn/ui
- Implement proper error handling
- Add loading states for async operations
- Test on multiple screen sizes

## 📝 Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Component Naming**: PascalCase for components, camelCase for files
- **Import Order**: React imports first, then third-party, then local imports

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Loading**
- Ensure variables start with `VITE_`
- Restart the development server after changes

**API Connection Issues**
- Check that the backend is running on the correct port
- Verify CORS configuration in the backend
- Check network connectivity

**Component Import Errors**
- Ensure the component is exported from the correct file
- Check the import path and alias configuration

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the backend API documentation
- Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with core contest functionality
- **v1.1.0**: Added AI-powered question generation
- **v1.2.0**: Enhanced admin dashboard and analytics
- **v1.3.0**: Improved mobile responsiveness and theme system</content>
<filePath>create_file">
<parameter name="filePath">c:\Users\Asus TUF\Desktop\code it out\frontend\README.md
