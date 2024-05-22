import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "./utils"

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
type ButtonBaseProps = { StartIcon?: SVGComponent; EndIcon?: SVGComponent; loading?: boolean; asChild?: boolean } & ButtonVariantProps
export type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonVariants = cva(
  cn(
    "relative flex w-fit items-center justify-center whitespace-nowrap transition",
    "rounded-lg",
    "font-medium",
    "disabled:pointer-events-none",
    "focus-visible:outline-none",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "border-none text-white",
          "bg-primary-600 hover:bg-primary-700",

          // Radial gradient
          "after:absolute after:inset-[1px] after:rounded-[calc(theme(borderRadius.lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,_theme(colors.white/16%)_0%,_theme(colors.white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_theme(colors.primary.600/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_theme(colors.primary.700/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.white/44%),_inset_0_-1px_2px_theme(colors.primary.800/50%)]",

          // Disabled state
          "disabled:bg-primary-100",
          "disabled:shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.primary.50/55%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_theme(colors.primary.200/100%)]",

          // Focused state
          "focus-within:ring-3 focus-within:ring-primary-600/[.24]",
        ),
        secondary: cn(
          "border-none text-neutral-900",
          "bg-white hover:bg-neutral-50",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Inner border
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[shadow:theme(boxShadow.xs),_inset_0_0_0_1px_theme(colors.neutral.200/100%),_inset_0_-1px_2px_theme(colors.neutral.900/12%)]",

          // Disabled state
          "disabled:text-neutral-300",

          // Focused state
          "focus-within:ring-3 focus-within:ring-neutral-900/[.04]",
        ),
        tertiary: cn(
          "border-none text-primary-600",
          "bg-primary-50 hover:bg-primary-100",

          // Radial gradient
          "after:absolute after:inset-[1px] after:rounded-[calc(theme(borderRadius.lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,_theme(colors.white/16%)_0%,_theme(colors.white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_theme(colors.primary.100/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_theme(colors.primary.200/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.white/44%),_inset_0_-1px_2px_theme(colors.primary.200/24%)]",

          // Disabled state
          "disabled:bg-primary-50",
          "disabled:text-primary-200",
          "disabled:shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.white/50%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_theme(colors.primary.100/100%)]",

          // Focused state
          "focus-within:ring-3 focus-within:ring-primary-100/[.50]",
        ),
        destructive: cn(
          "border-none text-white",
          "bg-error-600 hover:bg-error-700",

          // Radial gradient
          "after:absolute after:inset-[1px] after:rounded-[calc(theme(borderRadius.lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,_theme(colors.white/16%)_0%,_theme(colors.white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_theme(colors.error.600/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_theme(colors.error.700/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.white/44%),_inset_0_-1px_2px_theme(colors.error.800/24%)]",

          // Disabled state
          "disabled:bg-error-100",
          "disabled:shadow-[shadow:theme(boxShadow.xs),_inset_0_1px_0.5px_0.5px_theme(colors.error.50/55%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_theme(colors.error.200/100%)]",

          // Focused state
          "focus-within:ring-3 focus-within:ring-error-600/[.24]",
        ),
        outline: "bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-9 px-3 text-sm",
        sm: "h-10 px-3.5 text-sm",
        md: "h-11  px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
      loading: {
        true: "text-transparent disabled:text-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
)

type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ElementType

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, StartIcon, EndIcon, loading, asChild = false, ...props }, ref) => {
    const disabled = props.disabled || loading

    const Comp = asChild ? Slot : "button"
    return (
      <Comp disabled={disabled} className={cn(buttonVariants({ variant, size, loading, className }))} ref={ref} {...props}>
        {StartIcon && <IconComponent size={size} position="start" Icon={StartIcon} />}
        {loading && <Spinner size={size} variant={variant} />}
        <Slottable>{props.children}</Slottable>
        {EndIcon && <IconComponent size={size} position="end" Icon={EndIcon} />}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

/* Spinner */
type SpinnerVariantProps = VariantProps<typeof spinnerVariants>
export type SpinnerProps = {} & SpinnerVariantProps & React.HTMLAttributes<SVGSVGElement>

const spinnerVariants = cva("animate-spin", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-neutral-300",
      tertiary: "text-primary-200",
      destructive: "text-white",
      outline: "",
      link: "",
    },
    size: {
      xs: "size-5",
      sm: "size-5",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
})

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(({ variant, size, className, ...props }, ref) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Loader2 strokeWidth={1.5} className={cn(spinnerVariants({ variant, size }), className)} ref={ref} {...props} />
    </div>
  )
})
Spinner.displayName = "Spinner"

/* Icon */
type IconVariantProps = VariantProps<typeof iconVariants>
export type IconProps = { Icon: SVGComponent } & IconVariantProps

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-4",
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
    },
    position: {
      start: "",
      end: "",
    },
  },
  defaultVariants: {
    size: "md",
    position: "start",
  },
  compoundVariants: [
    {
      size: "xs",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "sm",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "md",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "lg",
      position: "start",
      className: "mr-2",
    },
    {
      size: "xs",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "sm",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "md",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "lg",
      position: "end",
      className: "ml-2",
    },
  ],
})

const IconComponent = React.forwardRef<SVGSVGElement, IconProps>(({ size, position, Icon, ...props }, ref) => {
  return <Icon strokeWidth={1.5} aria-hidden className={cn(iconVariants({ size, position }), "")} {...props} ref={ref} />
})
IconComponent.displayName = "Icon"