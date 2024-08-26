import React from 'react';
import SearchHighlights from "@/app/(main)/search/page-highlights";
import {db} from "@/lib/db";
import {queryPinecone} from "@/lib/db-helper";
import SearchResults from "@/app/(main)/search/page-results";

export type SearchCell = {
  id: string;
  name: string;
  university: string;
  image: string;
  rating?: number;
  views?: number;
  tags: string[];
}

const Page = async ({ searchParams } : {searchParams: any}) => {
  //get top 10 in rated
  const q = searchParams.q;
  if (!q) {
    const topRated = (await db.professor.findMany({
      orderBy: {
        rating: "desc",
      },
      take: 10,
    })).map((i) => {
      return {
        name: i.name,
        university: i.school,
        rating: i.rating,
        tags: i.tags,
        image: i.imageUrl,
        id: i.id,
      } as SearchCell;
    })

    const topViewed = (await db.professor.findMany({
      orderBy: {
        viewed: "desc",
      },
      take: 10,
    })).map((i) => {
      return {
        name: i.name,
        university: i.school,
        views: i.viewed,
        tags: i.tags,
        image: i.imageUrl,
        id: i.id,
      } as SearchCell;
    })

    const topTotalStars = (await db.professor.findMany({
      orderBy: {
        totalStars: "desc",
      },
      take: 10,
    })).map((i) => {
      return {
        name: i.name,
        university: i.school,
        rating: i.totalStars,
        tags: i.tags,
        image: i.imageUrl,
        id: i.id,
      } as SearchCell;
    })

    return (
      <SearchHighlights
        topRated={topRated}
        topTotalStars={topTotalStars}
        topViewed={topViewed}
      />
    );
  } else {
    const profs = await queryPinecone(q , 30 , 10);
    const results = profs.map((i) => {
      return {
        name: i.name,
        university: i.school,
        rating: i.totalStars,
        views: i.viewed,
        tags: i.tags,
        image: i.imageUrl,
        id: i.id,
      } as SearchCell;
    })

    return <SearchResults results={results} keyword={q}/>
  }
};

export default Page;