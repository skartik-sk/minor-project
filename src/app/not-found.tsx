import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
  Sorry, we couldn&apos;t find the page you&apos;re looking for.
</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/dashboard">Return to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
