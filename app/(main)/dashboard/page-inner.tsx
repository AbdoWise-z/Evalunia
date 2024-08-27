'use client'

import React, {useEffect, useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Edit, Eye, Loader2, MessageSquare, Star, Trash2} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {useTheme} from 'next-themes'
import {Professor} from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import axios from "axios";
import Link from "next/link";


const PersonCard = ({ person , deleteTrigger , editTrigger } : {person: Professor , deleteTrigger: (prof: Professor) => void ,  editTrigger: (prof: Professor) => void}) => {
  const handleEdit = (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    editTrigger(person)
  }

  const handleDelete = (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    deleteTrigger(person);
  }

  return (
    <Card className="h-full group relative">
      <Link href={`/profile/${person.id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {person.name}
          </CardTitle>
          <Avatar className="h-10 w-10">
            <AvatarImage src={person.imageUrl ?? undefined} alt={person.name} />
            <AvatarFallback>{person.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-2">{person.school}</div>
          <div className="text-2xl font-bold mb-2">{person.rating.toFixed(1)}</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4" />
              {person.totalStars}
            </div>
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {person.viewed}
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4" />
              {person.totalReviews}
            </div>
          </div>
        </CardContent>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={handleEdit} className="mr-1">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {person.name}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {person.name}</span>
          </Button>
        </div>
      </Link>
    </Card>
  )
}

export default function Dashboard(
  {
    profs,
  } : {
    profs: Professor[]
  }
) {
  const { theme } = useTheme()

  const [persons , setPersons] = useState<Professor[]>([]);

  const [deletingProf , setDeletingProf] = useState<Professor | null>(null);
  const [editingProf , setEditingProf] = useState<Professor | null>(null);
  const [submtting , setSubmitting] = useState(false);

  const chartData = persons.map(person => ({
    name: person.name,
    stars: person.totalStars,
    views: person.viewed,
    reviews: person.totalReviews,
    rating: person.rating
  }));

  useEffect(() => {
    setPersons(profs)
  }, [profs]);

  const submitDelete = async () => {
    setSubmitting(true);
    try {
      const res = await axios.delete("/api/prof" , {
        data: {
          id: deletingProf?.id,
        }
      });

      if (res.status == 200) {
        setPersons((old) => {
          return old.filter((prof) => {
            return prof.id != deletingProf?.id;
          });
        })
      }

      setDeletingProf(null);
    } catch (e) {
      console.log(e);
    }

    setSubmitting(false);

  }


  const chartColors = {
    stars: theme === 'dark' ? '#fbbf24' : '#8884d8',
    views: theme === 'dark' ? '#34d399' : '#82ca9d',
    rating: theme === 'dark' ? '#60a5fa' : '#8884d8'
  }

  return (
    <div className="container mx-auto p-4 text-foreground">

      <Dialog open={editingProf != null} onOpenChange={(open?) => {
        if (!submtting){
          setEditingProf(null);
        }
      }}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6" >
            <DialogDescription
              className="text-center text-zinc-500"
            >
              {"Maybe one day I'll implement this .."} <br/>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter
            className="bg-gray-100 px-6 py-4">
            <div
              className="flex items-center justify-between w-full"
            >
              <Button
                onClick={() => {
                  setEditingProf(null);
                }}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deletingProf != null} onOpenChange={(open?) => {
        if (!submtting){
          setDeletingProf(null);
        }
      }}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6" >
            <DialogTitle className="text-2xl text-center font-bold" >
              Delete Professor
            </DialogTitle>
            <DialogDescription
              className="text-center text-zinc-500"
            >
              Are you sure you want to perform this action ? <br/>
              <span className="font-semibold text-indigo-500">{deletingProf?.name}</span> record will be permanently deleted. <br/>
              <span className="font-semibold text-rose-400 text-xs">(This action cannot be undone)</span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter
            className="bg-gray-100 px-6 py-4">
            <div
              className="flex items-center justify-between w-full"
            >
              <Button
                onClick={() => {
                  setDeletingProf(null);
                }}
                variant="ghost"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  submitDelete();
                }}
              >
                Confirm
                {(submtting) && (<div>
                  <Loader2 className="ml-2 w-4 h-4 animate-spin"/>
                </div>)}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className={"font-bold mb-2"}>Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Stars and Views Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip contentStyle={{backgroundColor: 'var(--background)', color: 'var(--foreground)'}}/>
                <Legend/>
                <Bar dataKey="stars" fill={chartColors.stars} name="Total Stars"/>
                <Bar dataKey="views" fill={chartColors.views} name="Total Views"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip contentStyle={{backgroundColor: 'var(--background)', color: 'var(--foreground)'}}/>
                <Legend/>
                <Line type="monotone" dataKey="rating" stroke={chartColors.rating} name="Average Rating"/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <h1 className={"font-bold mb-2 mt-4"}>Your Professors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {persons.map(person => (
          <PersonCard key={person.id} person={person}
                      deleteTrigger={
                        (p: Professor) => {
                          setDeletingProf(p);
                        }
                      }

                      editTrigger={
                        (p: Professor) => {
                          setEditingProf(p);
                        }
                      }
          />
        ))}
      </div>
    </div>
  )
}