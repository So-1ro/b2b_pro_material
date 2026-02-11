"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/lib/context/cart-context"

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
