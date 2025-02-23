// app/providers.tsx
'use client'

import { HeroUIProvider } from "@heroui/react"
import { ToastContainer } from "react-toastify"


export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
      <ToastContainer/>
    </HeroUIProvider>
  )
}
