'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  // Load query from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const q = searchParams.get('q')
      if (q) {
        setQuery(q)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <Input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search recipes"
        className="w-full pl-9 pr-9 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring"
        autoComplete="off"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 h-7 w-7 p-0"
          type="button"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </Button>
      )}
    </form>
  )
}
