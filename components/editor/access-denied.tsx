import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-base">
      <Lock className="h-8 w-8 text-copy-muted" />
      <p className="text-sm text-copy-secondary">
        This project doesn&apos;t exist or you don&apos;t have access.
      </p>
      <Button asChild variant="ghost" size="sm">
        <Link href="/editor">Back to editor</Link>
      </Button>
    </div>
  )
}
