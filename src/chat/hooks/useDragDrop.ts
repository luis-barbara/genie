"use client";
import { useState, useCallback, useRef } from "react";
import type { Attachment } from "../lib/types";

export function useDragDrop(onDrop: (files: Attachment[]) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items.length > 0) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const attachments: Attachment[] = files.map((f) => ({
      id: `drop-${Date.now()}-${Math.random()}`,
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : "file",
      file: f,
    }));
    if (attachments.length > 0) onDrop(attachments);
  }, [onDrop]);

  return { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
}