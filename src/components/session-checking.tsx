import { Loader2 } from "lucide-react"

export default function SessionLoading() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h3 className="text-xl font-medium">Checking authentication...</h3>
        <p className="text-sm text-muted-foreground">Please wait while we verify your session</p>
      </div>
    </div>
  )
}
