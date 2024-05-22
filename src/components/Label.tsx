"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "./utils"

export type LabelRef = React.ElementRef<typeof LabelPrimitive.Root>

export type LabelVariantProps = VariantProps<typeof labelVariants>
export type LabelBaseProps = {} & LabelVariantProps
export type LabelProps = LabelBaseProps & React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const labelVariants = cva("text-neutral-900 peer-disabled:pointer-events-none peer-disabled:text-neutral-400", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
    },
  },
  defaultVariants: { size: "sm" },
})

const Label = React.forwardRef<LabelRef, LabelProps>(({ size, className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ size }), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }