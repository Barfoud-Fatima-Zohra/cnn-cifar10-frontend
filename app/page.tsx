"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  IconCar,
  IconCat,
  IconDeer,
  IconDog,
  IconFeather,
  IconHorse,
  IconPlane,
  IconShip,
  IconTruck
} from "@tabler/icons-react"
import { AlertCircle, Brain, CheckCircle2, ImageIcon, Sparkles, TrendingUp, Upload, XCircle } from "lucide-react"
import { useRef, useState } from "react"
import { FaFrog } from "react-icons/fa"



// const CIFAR_CLASSES = [
//   { name: "airplane", icon: "✈️" },
//   { name: "automobile", icon: "🚗" },
//   { name: "bird", icon: "🐦" },
//   { name: "cat", icon: "🐱" },
//   { name: "deer", icon: "🦌" },
//   { name: "dog", icon: "🐕" },
//   { name: "frog", icon: "🐸" },
//   { name: "horse", icon: "🐴" },
//   { name: "ship", icon: "⛵" },
//   { name: "truck", icon: "🚚" },
// ]

const CIFAR_CLASSES = [
  { name: "airplane", icon: IconPlane },
  { name: "automobile", icon: IconCar },
  { name: "bird", icon: IconFeather }, // pas d'icône "bird" exacte, feather = symbole léger
  { name: "cat", icon: IconCat },
  { name: "deer", icon: IconDeer },
  { name: "dog", icon: IconDog },
  { name: "frog", icon: FaFrog }, // pas d'icône frog, on met un insecte
  { name: "horse", icon: IconHorse },
  { name: "ship", icon: IconShip },
  { name: "truck", icon: IconTruck },
]


export default function Home() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [prediction, setPrediction] = useState<{ class: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
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
                    disabled={loading}
                    onClick={async () => {
                      if (!selectedFile) return
                      setLoading(true)
                      setError(null)
                      setPrediction(null)

                      try {
                        const formData = new FormData()

                        formData.append("file", selectedFile)

                        const apiBase = "http://localhost:5000"
                        // const apiBase = process.env.NEXT_PUBLIC_API_BASE  || "http://localhost:5000" 
                        const res = await fetch(`${apiBase}/predict`, {
                          method: "POST",
                          body: formData,
                        })

                        const data = await res.json()
                        console.log("prediction : ", data.prediction)
                        if (res.ok && data.prediction) {
                          setPrediction({
                            class: data.prediction,
                          })
                        }
                        else if (data.error) {
                          setError(data.error)
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
                    {/* <Sparkles className="w-4 h-4" />
                    Predict class */}

                    {loading ? (
                      <svg
                        className="animate-spin w-4 h-4 mr-2 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {loading ? "Predicting..." : "Predict class"}
                  </Button>
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

        {error && (
          <Card className="card-glow bg-gradient-to-br from-red-500/10 via-card to-card border-red-500/30 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive" className="gap-1.5">
                      <XCircle className="w-3 h-3" />
                      Error
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Prediction failed</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {prediction && (
          <Card className="card-glow bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      Result
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    Predicted class:
                    <span className="text-primary capitalize flex items-center gap-1">
                      {prediction.class}
                      {(() => {
                        const Icon = CIFAR_CLASSES.find(
                          (c) => c.name === prediction.class
                        )?.icon
                        return Icon ? <Icon className="w-6 h-6 text-primary" /> : null
                      })()}
                    </span>
                  </h3>

                  <p className="text-sm text-muted-foreground">The CNN model has successfully analyzed your image</p>
                </div>

              </div>
            </div>
          </Card>
        )}

        {/* Classes grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Supported classes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CIFAR_CLASSES.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.name}
                  className="bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/30 transition-all duration-200 p-4 text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary-foreground" /> 
                  <p className="text-sm font-medium text-foreground capitalize">{item.name}</p>
                </Card>
              )
            })}
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
