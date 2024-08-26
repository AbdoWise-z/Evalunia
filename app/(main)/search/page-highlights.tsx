"use client";

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {Star, Search, Eye, EyeIcon} from "lucide-react"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import queryString from 'query-string';
import {useRouter} from "next/navigation";
import {SearchCell} from "@/app/(main)/search/page";



export interface SearchPageProps {
  topViewed: SearchCell[];
  topRated: SearchCell[];
  topTotalStars: SearchCell[];
}

export default function SearchHighlights(
  {
    topViewed,
    topRated,
    topTotalStars
  } : SearchPageProps
) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
  }

  const handleSubmit = () => {
    const url = queryString.stringifyUrl({
      url: "/search",
      query: {
        q: searchTerm,
      }
    })
    router.push(url);
    router.refresh();
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-muted text-primary-foreground py-6 mb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-primary">Evalunia</h1>
            <div className="relative flex-1 max-w-md w-full flex-row">

              <Input
                type="search"
                placeholder="Search by name, university, or tag..."
                value={searchTerm}
                onChange={handleSearch}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                className="pr-12 pl-4 py-2 flex-1 bg-primary-foreground text-primary border-2 border-primary-foreground focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-transparent"
              />

              <Button size={"icon"} className={"absolute right-0 top-0"} onClick={() => {handleSubmit()}}>
                <Search className={"w-8 h-8"}/>
              </Button>

            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className={"text-xl p-4"}>Top Viewed</h1>
        <div className="mx-3 columns-1 md:columns-2 lg:columns-3" style={{
          columnFill: "balance-all",
        }}>
          {topViewed.map(result => (
            <Link key={result.id} href={`/profile/${result.id}`}>
              <div className="w-full mb-6 break-inside-avoid">
                <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="w-16 h-16 flex-shrink-0">
                        <AvatarImage src={result.image} alt={result.name}/>
                        <AvatarFallback>{result.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold text-primary">{result.name}</h2>
                        <p className="text-muted-foreground">{result.university}</p>
                        <div className="flex items-center mt-1">
                          <EyeIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                          <span className="font-medium">{result.views}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className={"text-xl p-4"}>Top Rated</h1>
        <div className="mx-3 columns-1 md:columns-2 lg:columns-3" style={{
          columnFill: "initial",
        }}>
          {topRated.map(result => (
            <Link key={result.id} href={`/profile/${result.id}`}>
            <div key={result.id} className="w-full mb-6 break-inside-avoid">
              <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={result.image} alt={result.name}/>
                      <AvatarFallback>{result.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-primary">{result.name}</h2>
                      <p className="text-muted-foreground">{result.university}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current"/>
                        <span className="font-medium">{result.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {result.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className={"text-xl p-4"}>The Stars</h1>
        <div className="mx-3 columns-1 md:columns-2 lg:columns-3" style={{
          columnFill: "balance-all",
        }}>
          {topTotalStars.map(result => (
            <Link key={result.id} href={`/profile/${result.id}`}>
            <div key={result.id} className="w-full mb-6 break-inside-avoid">
              <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={result.image} alt={result.name}/>
                      <AvatarFallback>{result.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-primary">{result.name}</h2>
                      <p className="text-muted-foreground">{result.university}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current"/>
                        <span className="font-medium">{result.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {result.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}