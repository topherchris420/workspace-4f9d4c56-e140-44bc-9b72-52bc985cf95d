# 🚀 Vers3Dynamics

<div align="center">

![Z.ai Logo](public/logo.svg)

**A cutting-edge, production-ready web app scaffold featuring 3D visualizations, real-time communications, and modern development tools.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r179-orange?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-green?style=for-the-badge&logo=socket.io)](https://socket.io/)

[🎯 Demo](https://newproject-olive-xi.vercel.app/)) • [📚 Documentation](#documentation) • [🤖 AI Assistant](https://chat.z.ai)

</div>

---

## ✨ Unique Features

### 🧪 **R.A.I.N. Lab 3D Visualizations**
Experience cutting-edge 3D scientific apparatus simulations:
- **Biefeld-Brown Effect** - Electrokinetic propulsion visualization
- **Flux Capacitor** - Temporal mechanics interface
- **Zinsser Module** - Electrolytic force field generator
- **Electrokinetic Saucer** - Advanced propulsion system

### 🔄 **Real-time Communications**
- Full-duplex WebSocket connections via Socket.IO
- Live message broadcasting and synchronization
- Custom server integration with Next.js

### 🎨 **Advanced UI/UX**
- Comprehensive shadcn/ui component library
- Dark/Light theme switching with smooth transitions
- Responsive design with Tailwind CSS 4
- Framer Motion animations and micro-interactions

---

## 🛠 Technology Stack

<table>
<tr>
<td width="50%">

### 🎯 **Core Framework**
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality component system

### 🎪 **3D & Graphics**
- **🌐 Three.js r179** - 3D graphics library
- **⚛️ React Three Fiber** - React Three.js integration
- **🎭 React Three Drei** - Useful Three.js helpers
- **🎯 Cannon.js** - Physics simulation

</td>
<td width="50%">

### 🔄 **Real-time & State**
- **🔌 Socket.IO** - Real-time communication
- **🐻 Zustand** - Lightweight state management
- **🔄 TanStack Query** - Server state synchronization
- **🌐 Axios** - HTTP client

### 🗄️ **Database & Auth**
- **🗄️ Prisma** - Type-safe ORM
- **🔐 NextAuth.js** - Authentication solution
- **💾 SQLite** - Development database
- **📊 Advanced data handling**

</td>
</tr>
</table>

### 📋 **Forms & Validation**
- **🎣 React Hook Form** - Performant forms
- **✅ Zod** - Schema validation
- **🎯 Type-safe form handling**

### 🌍 **Internationalization & Utils**
- **🌍 Next Intl** - i18n support
- **📅 Date-fns** - Date utilities
- **🪝 ReactUse** - Essential React hooks
- **🖼️ Sharp** - Image processing

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nextjs_tailwind_shadcn_ts

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up the database
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

### 🌐 Available Scripts

```bash
# Development with hot reload and logging
npm run dev

# Production build
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database

# Code quality
npm run lint         # ESLint check
```

---

## 📁 Project Architecture

```
├── 🏗️  src/
│   ├── 📱 app/                    # Next.js App Router
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page with 3D lab
│   │
│   ├── 🧩 components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── apparatus/            # 3D scientific apparatus
│   │   │   ├── BiefeldBrown.tsx
│   │   │   ├── FluxCapacitor.tsx
│   │   │   ├── ZinsserModule.tsx
│   │   │   └── ElectrokineticSaucer.tsx
│   │   ├── effects/              # 3D visual effects
│   │   └── layout/               # Layout components
│   │
│   ├── 🪝 hooks/                 # Custom React hooks
│   ├── 📚 lib/                   # Utilities & configurations
│   │   ├── utils.ts              # Helper functions
│   │   ├── socket.ts             # Socket.IO setup
│   │   └── prisma.ts             # Database client
│   │
│   └── 🎨 styles/                # Additional styles
│
├── 🌍 public/                     # Static assets
│   ├── demo.html                 # Standalone 3D demo
│   ├── logo.svg                  # Animated SVG logo
│   └── three-test.html           # Three.js test page
│
├── 🗄️  prisma/                   # Database schema
├── 📋 examples/                   # Feature examples
│   └── websocket/                # WebSocket demo
│
├── ⚙️  Configuration Files
├── 🐳 Dockerfile                 # Container setup
├── 🚀 server.ts                  # Custom server
└── 📦 package.json              # Dependencies
```

---

## 🎮 Featured Components

### 🧪 **3D Scientific Apparatus**

#### Biefeld-Brown Effect Visualizer
```tsx
<BiefeldBrownApparatus 
  voltage={50000}
  resonance={0.8}
  animated={true}
/>
```
Real-time electrokinetic field visualization with dynamic particle effects.

#### Flux Capacitor Interface
```tsx
<FluxCapacitor 
  temporalFlux={1.21}
  gigawatts={true}
  timeline="present"
/>
```
Interactive temporal mechanics visualization with energy pulse animations.

### 🔌 **WebSocket Integration**

```tsx
// Real-time message system
const { socket, isConnected, messages } = useSocket();

socket.emit('message', { 
  text: 'Hello from the lab!',
  timestamp: new Date().toISOString()
});
```

### 🎨 **Advanced UI Components**

Full shadcn/ui integration with 50+ components:
- **Data Display**: Tables, Charts, Cards, Badges
- **Forms**: Inputs, Selectors, Validation
- **Feedback**: Alerts, Toasts, Progress bars
- **Navigation**: Breadcrumbs, Menus, Pagination
- **Overlays**: Dialogs, Popovers, Tooltips

---

## 🌟 Unique Capabilities

### 🔬 **Scientific Visualizations**
- Real-time physics simulations
- Interactive 3D apparatus controls
- Dynamic field effect rendering
- Multi-phase operation cycles

### 📡 **Real-time Features**
- WebSocket message broadcasting
- Live connection status monitoring
- Synchronized multi-user experiences
- Custom server-client integration

### 🎨 **Modern UI/UX**
- Smooth theme transitions
- Micro-interactions and animations
- Responsive design patterns
- Accessible component design

### 🏗️ **Developer Experience**
- Hot module replacement
- TypeScript throughout
- ESLint configuration
- Automated testing setup

---

## 🤖 AI-Powered Development

### **Optimized for Z.ai Integration**
This scaffold is specifically designed to work seamlessly with [Z.ai](https://chat.z.ai):

- **🎯 Intelligent Code Generation** - Generate components and features
- **🔧 Smart Debugging** - AI-assisted error resolution  
- **📝 Auto Documentation** - Generate comprehensive docs
- **🚀 Performance Optimization** - AI-powered improvements
- **🎨 UI Enhancement** - Design system improvements

### **Getting Started with Z.ai**
1. Visit [chat.z.ai](https://chat.z.ai)
2. Upload your project files
3. Ask Z.ai to extend or modify features
4. Get instant, production-ready code

---

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Socket.IO (optional)
SOCKET_PORT=3001
```

### Customization Options

#### Theme Configuration
```tsx
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      // Your custom color palette
    }
  }
}
```

#### 3D Scene Settings
```tsx
// Customize 3D rendering
const sceneConfig = {
  antialias: true,
  shadows: true,
  physicsEnabled: true,
  fogIntensity: 0.01
};
```

---

## 📚 Documentation

### Key Features Guide
- [🧪 3D Apparatus Guide](./docs/3d-apparatus.md)
- [🔌 WebSocket Implementation](./docs/websockets.md)
- [🎨 Component Library](./docs/components.md)
- [🗄️ Database Schema](./docs/database.md)

### API Reference
- [📡 Socket.IO Events](./docs/socket-events.md)
- [🗄️ Prisma Models](./docs/prisma-models.md)
- [🪝 Custom Hooks](./docs/hooks.md)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t z-ai-scaffold .
docker run -p 3000:3000 z-ai-scaffold
```

### Custom Server
```bash
npm run build
npm start
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component system
- **[Three.js](https://threejs.org/)** - Powerful 3D graphics
- **[Socket.IO](https://socket.io/)** - Real-time communication
- **[Prisma](https://prisma.io/)** - Modern database toolkit

---

<div align="center">

**Built with ❤️ by christopher**

**Supercharged by [Z.ai](https://chat.z.ai) 🚀**

[🌟 Star this repo](../../stargazers) • [🐛 Report Issues](../../issues) • [💬 Discussions](../../discussions)

</div>
