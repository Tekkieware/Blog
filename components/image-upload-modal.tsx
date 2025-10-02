"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload, Crop, RotateCw, Save, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary"
import { toast } from "sonner"

interface ImageUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (imageUrl: string, altText: string) => void
}
const uploadToCloudinary = async (file: File): Promise<string> => {
    const toastId = toast.loading("Uploading image...")
    try {
        const url = await uploadFileToCloudinary(file, "blog_images")
        toast.success("Image uploaded successfully!", { id: toastId })
        return url
    } catch (error) {
        toast.error("Image upload failed.", { id: toastId })
        throw error
    }
}

export function ImageUploadModal({ isOpen, onClose, onSave }: ImageUploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [altText, setAltText] = useState<string>("")
    const [isUploading, setIsUploading] = useState(false)
    const [editMode, setEditMode] = useState(false)

    // Image editing states
    const [brightness, setBrightness] = useState([100])
    const [contrast, setContrast] = useState([100])
    const [saturation, setSaturation] = useState([100])
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState([100])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            setAltText(file.name.replace(/\.[^/.]+$/, ""))
        }
    }, [])

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            setAltText(file.name.replace(/\.[^/.]+$/, ""))
        }
    }, [])

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
    }, [])

    const resetEditing = () => {
        setBrightness([100])
        setContrast([100])
        setSaturation([100])
        setRotation(0)
        setZoom([100])
    }

    const handleSave = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        try {
            // Upload to Cloudinary
            const imageUrl = await uploadToCloudinary(selectedFile)
            onSave(imageUrl, altText)
            handleClose()
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setPreviewUrl("")
        setAltText("")
        setEditMode(false)
        resetEditing()
        onClose()
    }

    const imageStyle = {
        filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
        transform: `rotate(${rotation}deg) scale(${zoom[0] / 100})`,
        transition: "all 0.2s ease",
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="font-mono">Upload & Edit Image</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                    {/* Upload Area */}
                    <div className="lg:col-span-2">
                        {!selectedFile ? (
                            <Card
                                className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="p-12 text-center">
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-lg font-medium mb-2">Drop your image here</p>
                                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                                    <Button variant="outline" size="sm">
                                        Choose File
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="overflow-hidden">
                                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                                    <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        style={imageStyle}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="p-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                                                <Crop className="h-4 w-4 mr-2" />
                                                {editMode ? "Done Editing" : "Edit Image"}
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                Replace
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setPreviewUrl("")
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="altText">Alt Text</Label>
                            <Input
                                id="altText"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Describe the image..."
                            />
                        </div>

                        {editMode && selectedFile && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Brightness</Label>
                                    <Slider
                                        value={brightness}
                                        onValueChange={setBrightness}
                                        max={200}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-muted-foreground text-center">{brightness[0]}%</div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Contrast</Label>
                                    <Slider value={contrast} onValueChange={setContrast} max={200} min={0} step={1} className="w-full" />
                                    <div className="text-xs text-muted-foreground text-center">{contrast[0]}%</div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Saturation</Label>
                                    <Slider
                                        value={saturation}
                                        onValueChange={setSaturation}
                                        max={200}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-muted-foreground text-center">{saturation[0]}%</div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Zoom</Label>
                                    <Slider value={zoom} onValueChange={setZoom} max={200} min={50} step={1} className="w-full" />
                                    <div className="text-xs text-muted-foreground text-center">{zoom[0]}%</div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setRotation(rotation + 90)} className="flex-1">
                                        <RotateCw className="h-4 w-4 mr-2" />
                                        Rotate
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={resetEditing} className="flex-1 bg-transparent">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!selectedFile || isUploading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isUploading ? "Uploading..." : "Save Image"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
