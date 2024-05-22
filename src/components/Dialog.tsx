"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { buttonVariants } from "./Button"
import { cn } from "./utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

/* Dialog Overlay */
type DiaglogOverlayRef = React.ElementRef<typeof DialogPrimitive.Overlay>

export type DiaglogOverlayVariantProps = VariantProps<typeof diaglogOverlayVariants>
type DiaglogOverlayBaseProps = {} & DiaglogOverlayVariantProps
export type DiaglogOverlayProps = DiaglogOverlayBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

export const diaglogOverlayVariants = cva(
  cn(
    "fixed inset-0 z-50 bg-neutral-900/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ),
)

const DialogOverlay = React.forwardRef<DiaglogOverlayRef, DiaglogOverlayProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn(diaglogOverlayVariants(), className)} {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/* Dialog Content */
type DialogContentRef = React.ElementRef<typeof DialogPrimitive.Content>

export type DialogContentVariantProps = VariantProps<typeof dialogContentVariants>
type DialogContentBaseProps = {} & DialogContentVariantProps
export type DialogContentProps = DialogContentBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

export const dialogContentVariants = cva(
  cn(
    "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
    "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    "grid w-full max-w-[90vw] rounded-2xl border border-neutral-200 bg-white shadow-xl sm:max-w-lg",
  ),
)
const DialogContent = React.forwardRef<DialogContentRef, DialogContentProps>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(dialogContentVariants(), className)} {...props}>
      {children}
      <DialogCloseContent />
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/* Dialog Close */
type DialogCloseContentRef = React.ElementRef<typeof DialogPrimitive.Close>

export type DialogCloseContentVariantProps = VariantProps<typeof dialogCloseContentVariants>
type DialogCloseContentBaseProps = {} & DialogCloseContentVariantProps
export type DialogCloseContentProps = DialogCloseContentBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

export const dialogCloseContentVariants = cva(
  cn(buttonVariants({ variant: "secondary" }), "group absolute right-5 top-5 !size-6 !rounded !p-0 !text-neutral-500 sm:right-6 sm:top-6"),
)

const DialogCloseContent = React.forwardRef<DialogCloseContentRef, DialogCloseContentProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close ref={ref} className={cn(dialogCloseContentVariants())} {...props}>
    <X className="size-4 shrink-0 transition group-hover:text-neutral-900" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
))
DialogCloseContent.displayName = DialogPrimitive.Close.displayName

/* Dialog Header */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("p-5 sm:p-6", className)} {...props} />
DialogHeader.displayName = "DialogHeader"

/* Dialog Icon */
type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ElementType

export type DialogIconVariantProps = VariantProps<typeof dialogIconVariants>

type DialogIconBaseProps = { Icon: SVGComponent } & DialogIconVariantProps
export type DialogIconProps = DialogIconBaseProps & React.HTMLAttributes<HTMLDivElement>

export const dialogIconVariants = cva("mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", {
  variants: {
    variant: {
      error: "bg-error-50 text-error-500",
      primary: "bg-primary-50 text-primary-500",
      success: "bg-success-50 text-success-500",
      warning: "bg-warning-50 text-warning-500",
      neutral: "bg-neutral-50 text-neutral-500",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

const DialogIcon = ({ variant, Icon, className, ...props }: DialogIconProps) => (
  <div className={cn(dialogIconVariants({ variant }), className)} {...props}>
    <Icon strokeWidth={1.5} aria-hidden className="h-6 w-6 shrink-0" />
  </div>
)
DialogIcon.displayName = "DialogIcon"

/* Dialog Body */
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("px-6 pb-6 pt-0", className)} {...props} />
DialogBody.displayName = "DialogBody"

/* Dialog Footer */
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex w-full flex-col justify-end gap-3 border-t border-neutral-200 p-5 sm:flex-row sm:px-6 sm:py-3.5 ", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/* Dialog Title */
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn("text-xl font-medium", className)} {...props} />,
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

/* Dialog Description */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn("mt-2 text-neutral-500", className)} {...props} />)
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogBody,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogIcon,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}