import { Star } from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";

interface ReviewProps {
  content: string
  user: {
    name: string
    image: string
  }
  rating: number
}

export default function Review({ content, user, rating }: ReviewProps) {
  const roundedRating = Math.round(rating)

  return (
    <div className="max-w-[100%] md:max-w-[80%] p-4 border border-border rounded-lg bg-background">
      <div className="flex items-center mb-3">
        <Avatar className={"w-10 h-10"}>
          <AvatarImage src={user.image || undefined} alt={user.name}/>
          <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground ml-2">{user.name}</span>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={index < roundedRating ? "text-primary fill-primary" : "text-muted-foreground"}
            size={20}
          />
        ))}
      </div>
      <p className="text-muted-foreground">{content}</p>
    </div>
  )
}