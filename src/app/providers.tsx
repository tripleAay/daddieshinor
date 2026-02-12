// app/providers.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'  // ← add useEffect

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Prevent double-init in React Strict Mode / dev
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: '2026-01-30',
        // Optional: add debug: true to see console logs during testing
        // debug: true,
      })
      console.log('PostHog initialized successfully')
    }
  }, [])  // Empty array = run once on mount

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}