"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, ImageIcon, Sparkles, Upload } from "lucide-react"
import { useRef, useState } from "react"

const CIFAR_CLASSES = [
  { name: "airplane", icon: "✈️" },
  { name: "automobile", icon: "🚗" },
  { name: "bird", icon: "🐦" },
  { name: "cat", icon: "🐱" },
  { name: "deer", icon: "🦌" },
  { name: "dog", icon: "🐕" },
  { name: "frog", icon: "🐸" },
  { name: "horse", icon: "🐴" },
  { name: "ship", icon: "⛵" },
  { name: "truck", icon: "🚚" },
]

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    // Clear any previous prediction when a new file is selected
    setPrediction(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="gradient-glow fixed inset-x-0 top-0 h-[500px] pointer-events-none" />

      
      <header className="relative border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CIFAR-10 Classifier</h1>
              <p className="text-xs text-muted-foreground">Powered by CNN</p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>AI Model</span>
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="relative container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Image Classification with CNN
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Upload an image to predict its class among the 10 CIFAR-10 categories using our convolutional neural
            network model.
          </p>
        </div>

        {/* Upload card */}
        <Card className="card-glow bg-card border-border/50 p-8 mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
          >
            <input ref={fileInputRef} type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileInput} />

            {preview ? (
              <div className="p-8">
                <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden border border-border">
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      fileInputRef.current?.click()
                    }}
                  >
                    Change image
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={async () => {
                      if (!selectedFile) return
                      setLoading(true)
                      setError(null)
                      setPrediction(null)

                      try {
                        const formData = new FormData()

                        const apiBase = process.env.NEXT_PUBLIC_API_BASE  || "http://localhost:5000" 
                        const res = await fetch(`${apiBase}/predict`, {
                          method: "POST",
                          body: formData,
                        })

                        const data = await res.json()

                        if (data.error) {
                          setError(data.error)
                        } else if (data.prediction) {
                          setPrediction(data.prediction)
                        } else {
                          setError("Unexpected server response")
                        }
                      } catch (err: any) {
                        setError(err?.message || String(err))
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Predict class
                  </Button>
                </div>

                {/* Result area */}
                <div className="mt-4 text-center">
                  {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                  {error && <p className="text-sm text-destructive">Error: {error}</p>}
                  {prediction && (
                    <p className="text-lg font-semibold text-foreground">Prediction: {prediction}</p>
                  )}
                </div>
                
              </div>
            ) : (
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center py-16 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
                <Badge variant="secondary" className="gap-1.5">
                  <ImageIcon className="w-3 h-3" />
                  PNG, JPG, JPEG
                </Badge>
              </label>
            )}
          </div>
        </Card>

        {/* Classes grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Supported classes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CIFAR_CLASSES.map((item) => (
              <Card
                key={item.name}
                className="bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/30 transition-all duration-200 p-4 text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-foreground capitalize">{item.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Info section */}
        <Card className="bg-secondary/30 border-border/50 p-6 mt-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">About the model</h4>
              <p className="text-sm text-muted-foreground text-pretty">
                This classifier uses a convolutional neural network (CNN) trained on the CIFAR-10 dataset and can
                recognize 10 object categories with high accuracy.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
