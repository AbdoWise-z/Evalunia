'use client'

import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";

export default function RedirectToSignInPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 p-8 rounded-lg border border-border">
        <h1 className="text-3xl font-bold tracking-tighter">Please Sign In First</h1>
        <p className="text-muted-foreground max-w-[400px]">
          To access this page, you need to be signed in. Please click the button below to go to the sign-in page.
        </p>
        <Button onClick={handleSignIn} size="lg">
          Go to Sign In
        </Button>
      </div>
    </div>
  )
}