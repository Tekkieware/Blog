"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
    Code,
    ImageIcon,
    Heading1,
    Heading2,
    Heading3,
} from "lucide-react"
import { ImageUploadModal } from "./image-upload-modal"

interface EnhancedRichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function EnhancedRichTextEditor({
    value,
    onChange,
    placeholder = "Start writing...",
    className = "",
}: EnhancedRichTextEditorProps) {
    const [showImageModal, setShowImageModal] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const insertText = useCallback(
        (before: string, after = "", placeholder = "") => {
            const textarea = textareaRef.current
            if (!textarea) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const selectedText = value.substring(start, end)
            const textToInsert = selectedText || placeholder

            const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
            onChange(newText)

            // Set cursor position
            setTimeout(() => {
                const newCursorPos = start + before.length + textToInsert.length
                textarea.setSelectionRange(newCursorPos, newCursorPos)
                textarea.focus()
            }, 0)
        },
        [value, onChange],
    )

    const handleImageSave = useCallback(
        (imageUrl: string, altText: string) => {
            const imageMarkdown = `![${altText}](${imageUrl})`
            insertText(imageMarkdown)
            setShowImageModal(false)
        },
        [insertText],
    )

    const toolbarButtons = [
        { icon: Heading1, action: () => insertText("# ", "", "Heading 1"), title: "Heading 1" },
        { icon: Heading2, action: () => insertText("## ", "", "Heading 2"), title: "Heading 2" },
        { icon: Heading3, action: () => insertText("### ", "", "Heading 3"), title: "Heading 3" },
        { icon: Bold, action: () => insertText("**", "**", "bold text"), title: "Bold" },
        { icon: Italic, action: () => insertText("*", "*", "italic text"), title: "Italic" },
        { icon: Link, action: () => insertText("[", "](url)", "link text"), title: "Link" },
        { icon: ImageIcon, action: () => setShowImageModal(true), title: "Image" },
        { icon: Code, action: () => insertText("```", "```", "code"), title: "Inline Code" },
        { icon: Quote, action: () => insertText("> ", "", "quote"), title: "Quote" },
        { icon: List, action: () => insertText("- ", "", "list item"), title: "Bullet List" },
        { icon: ListOrdered, action: () => insertText("1. ", "", "list item"), title: "Numbered List" },
    ]

    return (
        <div className={`border border-border rounded-md ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
                {toolbarButtons.map((button, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={button.action}
                        title={button.title}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        <button.icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>

            {/* Editor */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[400px] p-4 bg-background text-foreground resize-none focus:outline-none font-mono text-sm leading-relaxed"
                style={{
                    fontFamily:
                        'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
            />

            {/* Image Upload Modal */}
            <ImageUploadModal isOpen={showImageModal} onClose={() => setShowImageModal(false)} onSave={handleImageSave} />
        </div>
    )
}
