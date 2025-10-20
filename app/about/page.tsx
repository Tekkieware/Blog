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
                    src="/photo.jpg?height=200&width=200"
                    alt="Author"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-4">
                <a href="" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/isaiah-ozadhe/" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </a>
                <a href="https://github.com/Tekkieware" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </a>
                <a href="https://isaiahozadhe.tech" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                    <Globe className="h-4 w-4 text-[#10B981]" />
                    <span className="sr-only">Website</span>
                  </Button>
                </a>
              </div>

              <a href="https://isaiahozadhe.tech/#contact" target="_blank">
                <Button variant="outline" className="mt-2 w-full border-primary/20 hover:bg-primary/10">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </a>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold font-mono">Isaiah Ozadhe</h2>
                <p className="text-muted-foreground">Software Engineer</p>
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
                  Hello, I'm Isaiah — a full-stack engineer who transforms complex problems into fast and reliable solutions.
                  I craft intuitive and engaging user experiences with <strong>React</strong>, <strong>Next.js</strong>, and <strong>TypeScript</strong>,
                  while building robust backends using <strong>Python</strong>, <strong>Flask</strong>, <strong>Django</strong>, and <strong>FastAPI</strong>.
                </p>



                <p>
                  From pixel-perfect designs to high-performance APIs, I thrive on the entire development lifecycle.
                  My toolkit includes <strong>Docker</strong>, <strong>CI/CD</strong>, <strong>MongoDB, PostgreSQL, MySQL</strong>, and modern state management —
                  everything needed to ship production-ready systems that serve users well.
                </p>

                <p>
                  This blog is my digital workshop where I share real-world insights, debugging adventures, and the patterns
                  I've discovered building real applications. If you're passionate about clean code and smart architecture,
                  welcome home.
                </p>

                <p>
                  Got questions about a technical challenge? Interested in collaborating on a project? Looking to hire?
                  I'm always open to connecting with fellow developers and exploring new opportunities.
                  <strong> Don't hesitate to reach out!</strong>
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
                      <div className="h-full bg-indigo-400 w-[95%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Backend Engineering</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[95%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Team Leadership</div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[95%] rounded-full"></div>
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
          <Card className="p-6 md:p-8 border-2 border-primary/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                Explore my latest projects and technical work
              </p>
              <div className="w-full bg-background/50 rounded-lg overflow-hidden border border-primary/20">
                <iframe
                  src="https://www.isaiahozadhe.tech/#projects"
                  width="100%"
                  height="600"
                  className="border-0"
                  title="Featured Projects from Portfolio"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="text-center pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                >
                  <Link href="https://www.isaiahozadhe.tech/#projects" target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    View Full Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
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
              <Link href="https://isaiahozadhe.tech/#contact" target="_blank">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
