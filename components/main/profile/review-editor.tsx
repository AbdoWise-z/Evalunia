"use client"

import React, {useEffect, useState} from "react"
import {Loader2, Star} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {useRouter} from "next/navigation";
import axios from "axios";

export default function ReviewEditor(
  {
    prevRating ,
    prevContent ,
    prof_id,
  } : {
    prevRating: number,
    prevContent: string,
    prof_id: string
  }
) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter();

  if (rating < 1){
    setRating(1);
  }

  useEffect(() => {
    setRating(prevRating);
    setContent(prevContent);
  } , [prevRating , prevContent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true);
    try {
      const res = await axios.post(
        "/api/review",
        {
          review: content,
          rating: rating,
          prof_id: prof_id,
        }
      )

      if (res.data?.status == 200){
        router.push("/profile/" + prof_id);
      }
    } catch (e) {
      console.log(e)
    }
    setSubmitting(false);
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Submit a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">
            Rating
          </Label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                disabled={submitting}
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={star <= rating ? "text-primary fill-primary" : "text-muted-foreground"}
                  size={24}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Review
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your review here..."
            className=""
            rows={4}
            required
            disabled={submitting}
          />
        </div>

        <Button type="submit" disabled={submitting}>
          Submit Review
          {(submitting) && (<div>
            <Loader2 className="ml-2 w-4 h-4 animate-spin"/>
          </div>)}
        </Button>
      </form>
    </div>
  )
}