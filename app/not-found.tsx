import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Recipe not found. It might have been deleted or moved to a different location.
        </p>
        <Link href="/">
          <Button size="lg" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
