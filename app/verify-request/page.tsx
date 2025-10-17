import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyRequestPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                        A sign in link has been sent to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>Click the link in the email to sign in to your account.</p>
                        <p className="mt-2">If you don't see the email, check your spam folder.</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block text-sm text-primary hover:underline"
                    >
                        ← Back to blog
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}