import * as React from "react"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "./utils"

type InputRef = HTMLInputElement
export type InputVariantProps = VariantProps<typeof inputClasses>
type InputBaseProps = {} & InputVariantProps
export type InputProps = InputBaseProps & Omit<JSX.IntrinsicElements["input"], "size">

export const inputClasses = cva(
  cn(
    "peer flex w-full appearance-none rounded-lg bg-white transition focus-visible:outline-none",
    "border focus-within:ring-3",
    "shadow-[0_1px_2px_0_theme(colors.neutral.900/6%)]",
    "disabled:pointer-events-none disabled:border-gray-200 disabled:bg-gray-50",
    "placeholder:text-gray-400",
  ),
  {
    variants: {
      size: {
        xs: "px-[calc(theme(spacing[3])-1px)] py-[calc(theme(spacing[2])-1px)] text-sm",
        sm: "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] text-sm",
        md: "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[3])-1px)] text-sm",
        lg: "px-[calc(theme(spacing[4])-1px)] py-[calc(theme(spacing[3])-1px)] text-base",
      },
      invalid: {
        true: cn(
          "border-error-600",
          "focus-within:border-error-600 focus-within:ring-error-600/[.24]",
          "hover:border-error-600 hover:ring-error-600/[.24]",
        ),
        false: cn("border-neutral-200", "focus-within:border-primary-500 focus-within:ring-primary-600/[.24]", "hover:border-primary-500"),
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
)

const Input = React.forwardRef<InputRef, InputProps>(({ size, className, type, ...props }, ref) => {
  const invalid = props["aria-invalid"] === true

  return <input type={type} className={cn(inputClasses({ size, invalid }), className)} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }