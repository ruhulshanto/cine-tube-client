"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Label } from "./label"

export interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = React.useId()
    return (
      <div className="relative group/floating">
        <Input
          {...props}
          id={id}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer h-12 pt-4 pb-1 px-3 border-white/10 bg-white/5 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300",
            className
          )}
        />
        {label && (
          <Label
            htmlFor={id}
            className="absolute left-3 top-4 text-zinc-500 transition-all duration-300 pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
          >
            {label}
          </Label>
        )}
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
