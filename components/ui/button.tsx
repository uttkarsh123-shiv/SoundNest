import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-1/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-green-1 text-white hover:bg-green-2 shadow-sm hover:shadow-md hover:shadow-green-1/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
        outline:
          "border border-white-1/20 bg-transparent hover:bg-white-1/5 hover:border-green-1/40 text-white-1",
        secondary:
          "bg-white-1/10 text-white-1 hover:bg-white-1/15 border border-white-1/10",
        ghost: "hover:bg-white-1/5 text-white-1",
        link: "text-green-1 underline-offset-4 hover:underline hover:text-green-2",
        plain: 'border-none bg-transparent text-[16px] font-semibold leading-normal text-white-1 hover:text-green-1',
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
