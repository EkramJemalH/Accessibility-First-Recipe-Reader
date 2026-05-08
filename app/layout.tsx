import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import { AuthProvider } from '@/context/AuthContext'
import { RecipeProvider } from '@/context/RecipeContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { AccessibilityWrapper } from '@/components/accessibility-wrapper'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Accessibility-First Recipe Reader',
  description:
    'Browse, cook, and create recipes with deep accessibility support — voice guidance, high contrast, dyslexia-friendly mode, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <AuthProvider>
              <RecipeProvider>
                <FavoritesProvider>
                  <AccessibilityWrapper>
                    <Navbar />
                    <main id="main-content" className="min-h-[calc(100dvh-4rem)] pb-16 md:pb-0">
                      {children}
                    </main>
                    <BottomNav />
                  </AccessibilityWrapper>
                </FavoritesProvider>
              </RecipeProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
