'use client'

import { ChatPanel } from '@/chat'
import { ToastProvider } from '@/chat'

export default function AppClient() {
  return (
    <ToastProvider>
      <ChatPanel />
    </ToastProvider>
  )
}
