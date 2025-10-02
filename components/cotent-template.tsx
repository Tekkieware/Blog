"use client"

export const contentTemplates = {
  technical: {
    title: "The Art of Component Composition",
    excerpt:
      "Discover advanced patterns for building maintainable React applications through effective component composition.",
    content: `![Developer Workspace](https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)

# Introduction

When building React applications, one of the most powerful patterns is **component composition**. This approach allows you to build complex UIs from simple, reusable pieces.

In this comprehensive guide, we'll explore advanced composition patterns that will transform how you architect React applications.

## Why Composition Matters

Composition gives you:

1. **Reusability** - Components can be used in multiple places
2. **Maintainability** - Smaller, focused components are easier to understand  
3. **Flexibility** - Composed components can be reconfigured easily
4. **Testability** - Isolated components are simpler to test

### The Problem with Monolithic Components

Consider this problematic approach:

\`\`\`jsx
// ❌ Monolithic component - hard to maintain and test
function ProfileCard({ user, onEdit, onDelete, showStats, showActions, theme }) {
  return (
    <div className={theme === 'dark' ? 'dark-card' : 'light-card'}>
      <div className="header">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      
      {showStats && (
        <div className="stats">
          <div>Posts: {user.postCount}</div>
          <div>Followers: {user.followers}</div>
          <div>Following: {user.following}</div>
        </div>
      )}
      
      {showActions && (
        <div className="actions">
          <button onClick={onEdit}>Edit Profile</button>
          <button onClick={onDelete}>Delete Account</button>
          <button onClick={() => window.open(\`/user/\${user.id}\`)}>
            View Full Profile
          </button>
        </div>
      )}
    </div>
  )
}
\`\`\`

### The Composition Solution

Instead, break it down into composable pieces:

\`\`\`jsx
// ✅ Composable components - flexible and maintainable
function ProfileCard({ children, className }) {
  return (
    <div className={cn("profile-card", className)}>
      {children}
    </div>
  )
}

function ProfileHeader({ user }) {
  return (
    <div className="profile-header">
      <Avatar src={user.avatar} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
\`\`\`

![Component Architecture](https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)

## Advanced Patterns

Let's explore some advanced composition patterns that can take your component design to the next level.

> 💡 **Pro Tip**: The goal isn't to make the most flexible component possible, but to create the right level of abstraction for your specific use case.

### Compound Components

Compound components are a pattern where multiple components work together to form a cohesive unit of functionality.

\`\`\`jsx
// Compound component example
function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
}
\`\`\`

## Best Practices

### 1. Start Small, Compose Up

Begin with the smallest possible components and compose them into larger ones:

\`\`\`jsx
// Start with atomic components
const Button = ({ children, variant = "default", ...props }) => (
  <button className={cn(buttonVariants({ variant }))} {...props}>
    {children}
  </button>
);
\`\`\`

## Conclusion

Component composition is one of the most powerful patterns in React development. By breaking down complex UIs into smaller, focused components, you create code that is more maintainable, reusable, and testable.

> 🚀 **Next Steps**: Try refactoring one of your existing components using these composition patterns. Start with the compound component pattern - it's often the most impactful!`,
    tags: "react, architecture, patterns",
    debug_notes: `Consider using React Context for deeply nested components
Avoid prop drilling more than 2 levels deep
Remember to memoize expensive calculations
Use TypeScript for better component interfaces
Test component composition boundaries`,
  },

  tutorial: {
    title: "Building Your First Next.js App",
    excerpt: "A step-by-step guide to creating a modern web application with Next.js, from setup to deployment.",
    content: `![https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)

# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications easier and more efficient. In this tutorial, we'll build a complete application from scratch.

## What You'll Learn

By the end of this tutorial, you'll know how to:

- Set up a Next.js project
- Create pages and components
- Handle routing and navigation
- Deploy your application

## Prerequisites

Before we begin, make sure you have:

- Node.js 18+ installed
- Basic knowledge of React
- A code editor (VS Code recommended)

## Step 1: Project Setup

Let's start by creating a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application with all the necessary dependencies.

## Step 2: Understanding the File Structure

Next.js uses a file-based routing system:

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── public/
└── package.json
\`\`\`

## Step 3: Creating Your First Component

Let's create a simple header component:

\`\`\`tsx
// components/Header.tsx
export function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">My Next.js App</h1>
    </header>
  )
}
\`\`\`

## Conclusion

You've successfully created your first Next.js application! From here, you can continue building more features and exploring the framework's capabilities.`,
    tags: "nextjs, tutorial, react",
    debug_notes: `Remember to use TypeScript for better development experience
Consider using Tailwind CSS for styling
Test your components as you build them
Deploy early and often to catch issues`,
  },
}

export function getRandomTemplate() {
  const templates = Object.values(contentTemplates)
  return templates[Math.floor(Math.random() * templates.length)]
}
