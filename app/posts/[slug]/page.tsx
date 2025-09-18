"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Calendar, Tag, ArrowLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { TableOfContents } from "@/components/table-of-content";
import { MarkdownRenderer } from "@/components/markdown-renderer";

const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
};

const generateToc = (markdown: string) => {
    const lines = markdown.split('\n');
    const toc: { id: string, title: string, level: number }[] = [];

    lines.forEach(line => {
        const match = line.match(/^(#+)\s+(.*)/);
        if (match) {
            const level = match[1].length;
            const title = match[2];
            const id = generateSlug(title);
            toc.push({ id, title, level });
        }
    });

    return toc;
};

const heroImage = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
const componentArchImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// Mock data for a single post with enhanced content
const post = {
  title: "The Art of Component Composition",
  date: "2023-05-15",
  author: "Senior Dev",
  readTime: "8 min read",
  layer: "frontend",
  tags: ["react", "architecture", "patterns"],
  excerpt: "Discover advanced patterns for building maintainable React applications through effective component composition.",
  content: `
![Developer Workspace](${heroImage})

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
        <img src={user.avatar} alt={user.name} />
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

function ProfileStats({ user }) {
  return (
    <div className="profile-stats">
      <Stat label="Posts" value={user.postCount} />
      <Stat label="Followers" value={user.followers} />
      <Stat label="Following" value={user.following} />
    </div>
  )
}

function ProfileActions({ onEdit, onDelete, onView }) {
  return (
    <div className="profile-actions">
      <Button variant="outline" onClick={onEdit}>
        Edit Profile
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        Delete Account
      </Button>
      <Button onClick={onView}>
        View Full Profile
      </Button>
    </div>
  )
}

// Usage - completely flexible!
<ProfileCard>
  <ProfileHeader user={user} />
  <ProfileStats user={user} />
  <ProfileActions 
    onEdit={handleEdit}
    onDelete={handleDelete}
    onView={handleView}
  />
</ProfileCard>
\`\`\`

![Component Architecture](${componentArchImage})

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

function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
}

function TabsTrigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={cn("tab-trigger", activeTab === value && "active")}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return <div className="tab-content">{children}</div>;
}

// Attach components to main component
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

// Usage
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  
  <Tabs.Content value="overview">
    <h2>Project Overview</h2>
    <p>Your project statistics and recent activity.</p>
  </Tabs.Content>
  
  <Tabs.Content value="analytics">
    <h2>Analytics Dashboard</h2>
    <p>Detailed insights about your project performance.</p>
  </Tabs.Content>
  
  <Tabs.Content value="settings">
    <h2>Project Settings</h2>
    <p>Configure your project preferences.</p>
  </Tabs.Content>
</Tabs>
\`\`\`

### Render Props Pattern

The render props pattern provides ultimate flexibility by allowing components to share stateful logic:

\`\`\`jsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data: users, loading, error }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    
    return (
      <UserList>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </UserList>
    );
  }}
</DataFetcher>
\`\`\`

### Custom Hooks for Logic Composition

Extract stateful logic into custom hooks for maximum reusability:

\`\`\`typescript
// Custom hook for form handling
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const setTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    reset,
  };
}

// Usage in components
function ContactForm() {
  const form = useForm({
    name: '',
    email: '',
    message: ''
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validation logic
    if (!form.values.name) {
      form.setError('name', 'Name is required');
      return;
    }
    
    // Submit logic
    try {
      await submitForm(form.values);
      form.reset();
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.values.name}
        onChange={(e) => form.setValue('name', e.target.value)}
        onBlur={() => form.setTouched('name')}
      />
      {form.touched.name && form.errors.name && (
        <span className="error">{form.errors.name}</span>
      )}
      
      {/* Other form fields */}
    </form>
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

const Input = ({ label, error, ...props }) => (
  <div className="input-group">
    {label && <label>{label}</label>}
    <input {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

// Compose into forms
const LoginForm = () => (
  <form>
    <Input label="Email" type="email" />
    <Input label="Password" type="password" />
    <Button type="submit">Sign In</Button>
  </form>
);
\`\`\`

### 2. Use TypeScript for Better Composition

TypeScript helps ensure your composed components work well together:

\`\`\`typescript
interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardProps extends BaseProps {
  variant?: 'default' | 'outlined' | 'elevated';
}

interface CardHeaderProps extends BaseProps {
  title: string;
  subtitle?: string;
}

const Card = ({ children, className, variant = 'default' }: CardProps) => (
  <div className={cn(cardVariants({ variant }), className)}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, className, children }: CardHeaderProps) => (
  <div className={cn("card-header", className)}>
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
    {children}
  </div>
);
\`\`\`

### 3. Document Your Composition APIs

Clear documentation helps other developers understand how to use your composed components:

\`\`\`jsx
/**
 * Modal component with compound API
 * 
 * @example
 * <Modal>
 *   <Modal.Trigger asChild>
 *     <Button>Open Modal</Button>
 *   </Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>
 *       <Modal.Title>Confirm Action</Modal.Title>
 *       <Modal.Description>
 *         This action cannot be undone.
 *       </Modal.Description>
 *     </Modal.Header>
 *     <Modal.Footer>
 *       <Modal.Close asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </Modal.Close>
 *       <Button>Confirm</Button>
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal>
 */
\`\`\`

## Conclusion

Component composition is one of the most powerful patterns in React development. By breaking down complex UIs into smaller, focused components, you create code that is:

- **More maintainable** - easier to understand and modify
- **More reusable** - components can be used across different contexts
- **More testable** - isolated components are simpler to test
- **More flexible** - different combinations create different experiences

Remember: the goal isn't to create the most generic components possible, but to find the right level of abstraction for your specific use case. Start simple, and add complexity only when you need it.

> 🚀 **Next Steps**: Try refactoring one of your existing components using these composition patterns. Start with the compound component pattern - it's often the most impactful!
`,
};

export default function PostDetail() {
  const tableOfContents = generateToc(post.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container py-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block sticky top-20 self-start h-fit">
            <TableOfContents items={tableOfContents} />
          </aside>

          {/* Main Content */}
          <article className="min-w-0">
            {/* Post Header */}
            <header className="mb-12 space-y-6">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                >
                  {post.layer}
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {post.date}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {post.readTime}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  {post.author}
                </div>
              </div>

              {/* Title and Excerpt */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-mono">
                  {post.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-mono">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Table of Contents - Mobile Only */}
            <div className="lg:hidden mb-8">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* Content */}
            <MarkdownRenderer content={post.content} />

            {/* Debug Notes - Mobile Only */}
            <div className="lg:hidden mt-12">
              <Card className="border-primary/20 bg-gradient-subtle shadow-soft">
                <div className="p-6">
                  <h4 className="font-mono font-bold mb-4 text-foreground flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Debug Notes
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">
                        Consider using React Context for deeply nested components
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">
                        Avoid prop drilling more than 2 levels deep
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">
                        Remember to memoize expensive calculations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">
                        Use TypeScript for better component interfaces
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">
                        Test component composition boundaries
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* Footer Actions */}
            <footer className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 text-primary"
                >
                  <a
                    href="https://twitter.com/intent/tweet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Share on X
                  </a>
                </Button>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-emphasis">
                  Subscribe for updates
                </Button>
              </div>
            </footer>
          </article>

          {/* Debug Notes - Desktop Only */}
          <aside className="hidden lg:block sticky top-20 self-start h-fit">
            <Card className="border-primary/20 bg-gradient-subtle shadow-soft">
              <div className="p-6">
                <h4 className="font-mono font-bold mb-4 text-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Debug Notes
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-muted-foreground">
                      Consider using React Context for deeply nested components
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-muted-foreground">
                      Avoid prop drilling more than 2 levels deep
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-muted-foreground">
                      Remember to memoize expensive calculations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-muted-foreground">
                      Use TypeScript for better component interfaces
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-muted-foreground">
                      Test component composition boundaries
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}