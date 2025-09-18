"use client"

import { useCallback, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
    ImageIcon,
    Code,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
} from "lucide-react"
import { Button } from "./button"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export interface RichTextEditorRef {
    focus: () => void
    blur: () => void
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    ({ value, onChange, placeholder = "Start writing...", className }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null)
        const [selectedText, setSelectedText] = useState("")
        const [selectionStart, setSelectionStart] = useState(0)
        const [selectionEnd, setSelectionEnd] = useState(0)

        useImperativeHandle(ref, () => ({
            focus: () => {
                if (textareaRef.current) {
                    textareaRef.current.focus()
                }
            },
            blur: () => {
                if (textareaRef.current) {
                    textareaRef.current.blur()
                }
            },
        }))

        const handleSelectionChange = useCallback(() => {
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart
                const end = textareaRef.current.selectionEnd
                const selected = value.substring(start, end)

                setSelectedText(selected)
                setSelectionStart(start)
                setSelectionEnd(end)
            }
        }, [value])

        const insertText = useCallback(
            (before: string, after = "") => {
                if (textareaRef.current) {
                    const textarea = textareaRef.current
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const selectedText = value.substring(start, end)

                    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
                    onChange(newText)

                    // Set cursor position after the inserted text
                    setTimeout(() => {
                        if (textarea) {
                            const newCursorPos = start + before.length + selectedText.length + after.length
                            textarea.setSelectionRange(newCursorPos, newCursorPos)
                            textarea.focus()
                        }
                    }, 0)
                }
            },
            [value, onChange],
        )

        const insertAtCursor = useCallback(
            (text: string) => {
                if (textareaRef.current) {
                    const textarea = textareaRef.current
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd

                    const newText = value.substring(0, start) + text + value.substring(end)
                    onChange(newText)

                    setTimeout(() => {
                        if (textarea) {
                            const newCursorPos = start + text.length
                            textarea.setSelectionRange(newCursorPos, newCursorPos)
                            textarea.focus()
                        }
                    }, 0)
                }
            },
            [value, onChange],
        )

        const wrapSelection = useCallback(
            (wrapper: string) => {
                insertText(wrapper, wrapper)
            },
            [insertText],
        )

        const insertHeading = useCallback(
            (level: number) => {
                const heading = "#".repeat(level) + " "
                if (textareaRef.current) {
                    const textarea = textareaRef.current
                    const start = textarea.selectionStart
                    const lineStart = value.lastIndexOf("\n", start - 1) + 1

                    const newText = value.substring(0, lineStart) + heading + value.substring(lineStart)
                    onChange(newText)

                    setTimeout(() => {
                        if (textarea) {
                            const newCursorPos = lineStart + heading.length
                            textarea.setSelectionRange(newCursorPos, newCursorPos)
                            textarea.focus()
                        }
                    }, 0)
                }
            },
            [value, onChange],
        )

        const insertList = useCallback(
            (ordered = false) => {
                const bullet = ordered ? "1. " : "- "
                if (textareaRef.current) {
                    const textarea = textareaRef.current
                    const start = textarea.selectionStart
                    const lineStart = value.lastIndexOf("\n", start - 1) + 1

                    const newText = value.substring(0, lineStart) + bullet + value.substring(lineStart)
                    onChange(newText)

                    setTimeout(() => {
                        if (textarea) {
                            const newCursorPos = lineStart + bullet.length
                            textarea.setSelectionRange(newCursorPos, newCursorPos)
                            textarea.focus()
                        }
                    }, 0)
                }
            },
            [value, onChange],
        )

        const insertBlockquote = useCallback(() => {
            if (textareaRef.current) {
                const textarea = textareaRef.current
                const start = textarea.selectionStart
                const lineStart = value.lastIndexOf("\n", start - 1) + 1

                const newText = value.substring(0, lineStart) + "> " + value.substring(lineStart)
                onChange(newText)

                setTimeout(() => {
                    if (textarea) {
                        const newCursorPos = lineStart + 2
                        textarea.setSelectionRange(newCursorPos, newCursorPos)
                        textarea.focus()
                    }
                }, 0)
            }
        }, [value, onChange])

        const insertCodeBlock = useCallback(() => {
            insertText("```\n", "\n```")
        }, [insertText])

        const insertLink = useCallback(() => {
            const url = prompt("Enter URL:")
            if (url) {
                const linkText = selectedText || "Link"
                insertText(`[${linkText}](${url})`)
            }
        }, [selectedText, insertText])

        const insertImage = useCallback(() => {
            const url = prompt("Enter image URL:")
            if (url) {
                const altText = prompt("Enter alt text (optional):") || "Image"
                insertAtCursor(`![${altText}](${url})`)
            }
        }, [insertAtCursor])

        const toolbarButtons = [
            { icon: Bold, action: () => wrapSelection("**"), title: "Bold" },
            { icon: Italic, action: () => wrapSelection("*"), title: "Italic" },
            { icon: Underline, action: () => wrapSelection("_"), title: "Underline" },
            { icon: Code, action: () => wrapSelection("`"), title: "Inline Code" },
        ]

        const blockButtons = [
            { icon: Heading1, action: () => insertHeading(1), title: "Heading 1" },
            { icon: Heading2, action: () => insertHeading(2), title: "Heading 2" },
            { icon: Heading3, action: () => insertHeading(3), title: "Heading 3" },
            { icon: Heading4, action: () => insertHeading(4), title: "Heading 4" },
            { icon: Heading5, action: () => insertHeading(5), title: "Heading 5" },
            { icon: Heading6, action: () => insertHeading(6), title: "Heading 6" },
            { icon: List, action: () => insertList(false), title: "Bullet List" },
            { icon: ListOrdered, action: () => insertList(true), title: "Numbered List" },
            { icon: Quote, action: insertBlockquote, title: "Blockquote" },
        ]

        const mediaButtons = [
            { icon: Link, action: insertLink, title: "Insert Link" },
            { icon: ImageIcon, action: insertImage, title: "Insert Image" },
            { icon: Code, action: insertCodeBlock, title: "Code Block" },
        ]

        return (
            <div className={cn("rich-text-editor border border-border rounded-md overflow-hidden", className)}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-card border-b border-border">
                    {/* Text formatting */}
                    {toolbarButtons.map(({ icon: Icon, action, title }) => (
                        <Button
                            key={title}
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={action}
                            className="h-8 w-8 p-0"
                            title={title}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    ))}

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Block formatting */}
                    {blockButtons.map(({ icon: Icon, action, title }) => (
                        <Button
                            key={title}
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={action}
                            className="h-8 w-8 p-0"
                            title={title}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    ))}

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Media buttons */}
                    {mediaButtons.map(({ icon: Icon, action, title }) => (
                        <Button
                            key={title}
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={action}
                            className="h-8 w-8 p-0"
                            title={title}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    ))}
                </div>

                {/* Editor */}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onSelect={handleSelectionChange}
                        onKeyUp={handleSelectionChange}
                        onMouseUp={handleSelectionChange}
                        placeholder={placeholder}
                        className="w-full min-h-[300px] p-4 bg-background text-foreground resize-none focus:outline-none font-mono text-sm leading-relaxed"
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                    />
                </div>

                {/* Preview hint */}
                <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground border-t border-border">
                    <span className="font-medium">Markdown supported:</span> **bold**, *italic*, `code`, # headings, - lists, &gt;
                    quotes, [links](url), ![images](url)
                </div>
            </div>
        )
    },
)

RichTextEditor.displayName = "RichTextEditor"
