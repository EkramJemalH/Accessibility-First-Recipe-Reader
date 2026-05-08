'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, PlusSquare, User } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 border-t bg-background md:hidden"
    >
      <ul className="flex h-16 items-stretch" role="list">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* Active indicator bar — non-color visual cue (Req 13.6) */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-primary"
                  />
                )}
                <Icon className="h-5 w-5" aria-hidden={true} />
                <span className={isActive ? 'font-semibold' : ''}>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
