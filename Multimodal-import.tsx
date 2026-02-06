'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Camera, FileAudio, X, Send, Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function DiagnosticIntakeForm() {
  const [description, setDescription] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!description && files.length === 0) {
      toast({ title: "Please provide some info", description: "Add a description or a photo of the issue.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Logic to upload files to Supabase Storage
      // 2. Logic to call your /api/diagnose route
      // 3. Redirect to the Results page we just built
      toast({ title: "Analysis Started", description: "Our AI is analyzing the symptoms..." })
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl">What's wrong with the vehicle?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text Input */}
          <Textarea 
            placeholder="Describe the noises, smells, or performance issues you're noticing..."
            className="min-h-[120px] text-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Media Previews */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 py-2">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                    ) : (
                      <FileAudio className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <button 
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className={cn("flex-1 gap-2", isRecording && "bg-red-50 text-red-600 border-red-200")}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className={cn("w-5 h-5", isRecording && "animate-pulse")} />
              {isRecording ? "Stop Recording" : "Record Noise"}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-5 h-5" />
              Add Photos
            </Button>
            <input 
              type="file" 
              multiple 
              accept="image/*,audio/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>

          <Button 
            className="w-full h-12 text-lg font-semibold mt-4" 
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
            ) : (
              <><Send className="mr-2 h-5 w-5" /> Run Diagnostic</>
            )}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        AI analysis provides a starting point. Always verify with a certified technician.
      </p>
    </div>
  )
}
