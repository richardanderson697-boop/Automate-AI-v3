'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, PlayCircle, Wrench, DollarSign } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ResultsProps {
  diagnosis: {
    diagnosis: string
    recommendedParts: string[]
    estimatedCost: number
    confidence: number
  }
  videos: any[] // Your grouped video results
}

export function DiagnosticResults({ diagnosis, videos }: ResultsProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 1. Header & Confidence Score */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnostic Report</h1>
          <p className="text-muted-foreground text-lg">AI-Powered Analysis of your vehicle</p>
        </div>
        <Card className="w-full md:w-64">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>AI Confidence</span>
              <span>{diagnosis.confidence}%</span>
            </div>
            <Progress value={diagnosis.confidence} className="h-2" />
          </CardContent>
        </Card>
      </section>

      {/* 2. Main Diagnosis Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-primary w-5 h-5" />
            Primary Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl leading-relaxed text-foreground/90">
            {diagnosis.diagnosis}
          </p>
        </CardContent>
      </Card>

      {/* 3. Parts & Labor Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Recommended Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnosis.recommendedParts.map((part, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{part}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Estimated Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              ${diagnosis.estimatedCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              *Estimate includes average local parts and labor rates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Educational Videos Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Learn About This Repair</h2>
        <Tabs defaultValue="walkthrough" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explanation">Symptoms</TabsTrigger>
            <TabsTrigger value="walkthrough">How It's Fixed</TabsTrigger>
            <TabsTrigger value="cost">Price Guide</TabsTrigger>
          </TabsList>
          
          {/* Placeholder for Video Grid Mapping */}
          <TabsContent value="walkthrough" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             {/* You would map your video-search results here */}
             <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border group cursor-pointer overflow-hidden relative">
                <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform z-10" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
             </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
