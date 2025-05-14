import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Github, Twitter, Linkedin, Globe, Mail, Terminal, Code, Server, Database, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-mono text-4xl font-bold mb-4">About the Author</h1>
          <div className="flex items-center justify-center">
            <div className="h-px w-16 bg-primary/50"></div>
            <span className="px-4 text-muted-foreground">The brain behind it all</span>
            <div className="h-px w-16 bg-primary/50"></div>
          </div>
        </div>

        {/* Author Profile Section */}
        <Card className="p-6 md:p-8 border-2 border-primary/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            {/* Avatar Column */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-md opacity-20"></div>
                <div className="relative h-48 w-48 rounded-full border-2 border-primary/30 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Author"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Globe className="h-4 w-4 text-[#10B981]" />
                  <span className="sr-only">Website</span>
                </Button>
              </div>

              <Button variant="outline" className="mt-2 w-full border-primary/20 hover:bg-primary/10">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold font-mono">Alex Morgan</h2>
                <p className="text-muted-foreground">Senior Software Engineer & System Architect</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-400">
                  <Terminal className="h-3 w-3 mr-1" />
                  3+ Years Experience
                </Badge>
                <Badge variant="outline" className="border-indigo-400/30 text-indigo-400">
                  <Code className="h-3 w-3 mr-1" />
                  Frontend
                </Badge>
                <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                  <Server className="h-3 w-3 mr-1" />
                  Backend
                </Badge>
                <Badge variant="outline" className="border-emerald-400/30 text-emerald-400">
                  <Database className="h-3 w-3 mr-1" />
                  Architecture
                </Badge>
                <Badge variant="outline" className="border-orange-400/30 text-orange-400">
                  <Users className="h-3 w-3 mr-1" />
                  Team Leadership
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4 text-muted-foreground">
                <p>
                  With over 12 years of experience in software engineering and system architecture, I've navigated the
                  full spectrum of development challenges across startups, enterprises, and everything in between.
                </p>
                <p>
                  My journey began as a frontend developer, crafting pixel-perfect interfaces and intuitive user
                  experiences. As I delved deeper into the stack, I developed a passion for backend systems, database
                  optimization, and distributed architectures that could scale to millions of users.
                </p>
                <p>
                  Throughout my career, I've led engineering teams through complex projects, mentored junior developers,
                  and established technical standards that balance innovation with maintainability. I believe that great
                  software is not just about code—it's about the people who build it and the processes that guide them.
                </p>
                <p>
                  This blog is my way of documenting the patterns, practices, and perspectives I've gathered along the
                  way. Whether you're debugging a tricky production issue or architecting your next big system, I hope
                  these insights help you navigate your own engineering journey.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="text-xl font-mono font-bold mb-4">Core Competencies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">System Architecture</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[95%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Frontend Development</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 w-[90%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Backend Engineering</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[85%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Team Leadership</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[80%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Projects Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-mono mb-6">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                <h3 className="text-xl font-mono font-bold mb-2">Project {i}</h3>
                <p className="text-muted-foreground mb-4">
                  A scalable, distributed system for processing real-time data streams with sub-millisecond latency.
                </p>
                <div className="flex gap-2">
                  <Badge>React</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>AWS</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold font-mono mb-4">Want to learn more?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore my thoughts on software engineering, system design, and team leadership through my blog posts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/posts">Read the Blog</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            >
              <Link href="mailto:contact@example.com">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
