# 🚀 Nexus 3D Todo AI

> **Revolutionary Task Management with 3D Visualization, AI-Powered Intelligence & Voice Control**

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Developed by [Ahsan Khizar](https://github.com/ahsankhizar5)**

</div>

---

## ✨ Features

🎯 **3D Task Universe** - Visualize tasks in stunning 3D space  
🤖 **AI-Powered Intelligence** - Smart prioritization & suggestions  
🎤 **Voice Control** - Create tasks with voice commands  
🎮 **Gamification System** - XP, levels, achievements & streaks  
🔇 **Focus Mode** - Distraction-free environment with ambient sounds  
📊 **Real-time Analytics** - Productivity insights & patterns  
🌙 **Multiple Themes** - Cosmic, Ocean, Forest, Sunset & Midnight  
📱 **Responsive Design** - Works on desktop, tablet & mobile  
🔒 **Privacy First** - All data stored locally, no cloud required  

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ahsankhizar5/nexus-3d-todo-ai.git
cd nexus-3d-todo-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

---

## 🖥️ User Interface

### 🎨 Main Dashboard
- **Clean Header** with app branding and developer credit
- **Task Input** with smart suggestions and voice integration
- **Tabbed Interface** for different views (List, 3D Universe, Stats, Achievements)
- **Stats Panel** showing level, points, and streak information
- **Theme Selector** with 5 beautiful themes

### 📝 Task Management
- **Add Tasks** via text input or voice commands
- **Priority Levels** with visual indicators
- **Completion Status** with smooth animations
- **Task Categories** for better organization
- **Drag & Drop** functionality (coming soon)

### 🌌 3D Universe View
- **Interactive 3D Environment** using Three.js
- **Floating Task Nodes** in space
- **Mouse Controls** for rotation and zoom
- **Task Clustering** by priority and category
- **Beautiful Particle Effects**

### 📊 Analytics Dashboard
- **Productivity Metrics** with visual charts
- **Completion Rates** over time
- **Task Distribution** by category
- **Performance Insights** and trends
- **Goal Tracking** with progress bars

### 🏆 Achievement System
- **XP Points** for completing tasks
- **Level Progression** with unlockable features
- **Achievement Badges** for milestones
- **Daily Streaks** to maintain consistency
- **Leaderboard** (personal best tracking)

### 🎧 Focus Mode
- **Minimal Interface** for distraction-free work
- **Ambient Sounds** (rain, forest, ocean waves)
- **Timer Integration** with Pomodoro technique
- **Current Task Highlight** with progress tracking
- **Exit Button** to return to main view

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.2.4 |
| **TypeScript** | Type Safety | 5.0+ |
| **React** | UI Library | 19.0+ |
| **Three.js** | 3D Graphics | Latest |
| **React Three Fiber** | React + Three.js | Latest |
| **Tailwind CSS** | Styling | 4.1.9 |
| **shadcn/ui** | UI Components | Latest |
| **Lucide React** | Icons | Latest |
| **Web Speech API** | Voice Recognition | Native |

---

## 📦 Installation

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Modern browser** with WebGL support

### Step-by-Step Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/ahsankhizar5/nexus-3d-todo-ai.git
   cd nexus-3d-todo-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup** (Optional)
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_APP_NAME="Nexus 3D Todo AI"
   NEXT_PUBLIC_VOICE_ENABLED=true
   NEXT_PUBLIC_SPEECH_LANG=en-US
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone permissions for voice features

---

## 🎮 Usage Guide

### Creating Tasks
- **Text Input**: Type your task and press Enter
- **Voice Command**: Click mic button and say "Add task [description]"
- **Quick Actions**: Use keyboard shortcuts (Ctrl+N for new task)

### Navigation
- **List View**: Traditional task list with checkboxes
- **3D Universe**: Interactive 3D visualization
- **Stats**: Analytics and productivity insights
- **Achievements**: XP, levels, and badges

### Voice Commands
- `"Add task [description]"` - Create new task
- `"Complete task [number]"` - Mark task as done
- `"Delete task [number]"` - Remove task
- `"Show stats"` - Switch to analytics view

### Keyboard Shortcuts
- `Ctrl + N` - New task
- `Ctrl + F` - Enter focus mode
- `Ctrl + T` - Switch theme
- `Esc` - Exit focus mode

---

## ⚙️ Configuration

### Environment Variables
```env
# Application Settings
NEXT_PUBLIC_APP_NAME="Nexus 3D Todo AI"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Voice Recognition
NEXT_PUBLIC_VOICE_ENABLED=true
NEXT_PUBLIC_SPEECH_LANG=en-US

# 3D Rendering
NEXT_PUBLIC_WEBGL_DEBUG=false
NEXT_PUBLIC_THREE_DEBUG=false

# Performance
NEXT_PUBLIC_PERFORMANCE_MONITORING=false
```

### Theme Customization
The app includes 5 built-in themes:
- **Cosmic**: Purple/blue space theme
- **Ocean**: Blue/teal underwater theme
- **Forest**: Green nature theme
- **Sunset**: Orange/pink warm theme
- **Midnight**: Dark blue night theme

---

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # TypeScript checking
```

### Project Structure
```
nexus-3d-todo-ai/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── header.tsx        # App header
│   ├── task-*.tsx        # Task-related components
│   ├── stats-panel.tsx   # Analytics dashboard
│   └── voice-control.tsx # Voice integration
├── contexts/             # React Context providers
│   ├── task-context.tsx  # Task state management
│   └── theme-context.tsx # Theme management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 🔧 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
npm run dev -- --port 3001
```

**3D view not loading**
- Update graphics drivers
- Enable hardware acceleration in browser
- Check WebGL support at [webgl.org](https://get.webgl.org/webgl2/)

**Voice control not working**
- Allow microphone permissions
- Use HTTPS or localhost only
- Works best in Chrome browser

**Performance issues**
- Close other browser tabs
- Reduce 3D effects in settings
- Ensure adequate RAM (8GB recommended)

---

## 📱 Browser Support

| Browser | Desktop | Mobile | Voice | WebGL |
|---------|---------|--------|-------|-------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ | ✅ |
| Safari | ✅ | ✅ | ❌ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |

---

## 🔒 Privacy & Security

- ✅ **Local Storage Only** - No data sent to external servers
- ✅ **No Tracking** - Zero analytics or user tracking
- ✅ **Offline First** - Works completely without internet
- ✅ **No Account Required** - Start using immediately
- ✅ **Open Source** - Transparent and auditable code

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

**Need help?** 

- 📧 **Email**: [ahsankhizar1075@gmail.com](mailto:ahsankhizar1075@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/ahsankhizar5/nexus-3d-todo-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ahsankhizar5/nexus-3d-todo-ai/discussions)

---

## 🙏 Acknowledgments

- **Three.js** for amazing 3D graphics capabilities
- **Next.js** team for the excellent React framework
- **Tailwind CSS** for beautiful styling system
- **shadcn/ui** for high-quality UI components
- **Web Speech API** for voice recognition features

---

<div align="center">

**Built with ❤️ by [Ahsan Khizar](https://github.com/ahsankhizar5)**

*Revolutionizing productivity through immersive 3D task management*

⭐ **Star this repo if you find it useful!** ⭐

</div>
