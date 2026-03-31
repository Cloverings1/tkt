import Link from "next/link"
import { Ticket } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TKT</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
