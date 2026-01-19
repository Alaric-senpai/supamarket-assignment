import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10 dark:to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-sm dark:shadow-md dark:shadow-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
              <Link 
                href={'/'} 
                className="flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight group"
              >

                <h2 className="text-md">
                  Next appwrite starter
                </h2>
              </Link>
            
            <Button asChild variant="outline" className="gap-2">
              <Link href="/auth/signup">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl border shadow-xl dark:shadow-primary/10 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 5, 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to NextAppwrite. By accessing or using our service, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            {/* Account Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Account Terms</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  You must be 13 years or older to use this service. By creating an account, you represent that you are at least 13 years of age.
                </p>
                <p>
                  You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>
                <p>
                  You are responsible for all content posted and activity that occurs under your account.
                </p>
                <p>
                  You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction.
                </p>
              </div>
            </section>

            {/* User Data */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Data and Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect and process personal data in accordance with our Privacy Policy. By using our service, you consent to such processing and you warrant that all data provided by you is accurate.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>We store your account information securely</li>
                <li>We use your email for authentication and communication</li>
                <li>We do not sell your personal data to third parties</li>
                <li>You can request deletion of your account at any time</li>
              </ul>
            </section>

            {/* Service Usage */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute spam, malware, or other harmful content</li>
                <li>Attempt to gain unauthorized access to the service or other users' accounts</li>
                <li>Interfere with or disrupt the integrity or performance of the service</li>
                <li>Create multiple accounts to abuse service features</li>
              </ul>
            </section>

            {/* OAuth Providers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Authentication</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service offers authentication through third-party providers (GitHub, Google). When you use these services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>You agree to their respective terms of service and privacy policies</li>
                <li>We receive limited profile information as permitted by the provider</li>
                <li>You can revoke access at any time through the provider's settings</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service and its original content, features, and functionality are owned by NextAppwrite and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall NextAppwrite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                <p className="font-medium">Email: support@nextappwrite.com</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="pt-8 border-t">
              <p className="text-muted-foreground leading-relaxed">
                By creating an account and using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t">
            <Button asChild className="flex-1">
              <Link href="/auth/signup">
                I Accept - Create Account
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                Go Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 dark:border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with <span className="text-primary">Next.js</span> and <span className="text-primary">Appwrite</span> • MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
