import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  children: React.ReactNode
}

export function SignupButton({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Be one of the first $PADEL holders</DialogTitle>
          <DialogDescription>
            We&apos;re currently invite-only during our beta period but register
            now as we&apos;ll be distributing over one million $PADEL to early
            adopters!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-rows-2 items-center gap-4">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value="your@email.com" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Let&apos;s go!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
