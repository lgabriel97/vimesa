"use client"

import * as React from "react"
import { RadioGroup as RadixRadioGroup } from "radix-ui"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadixRadioGroup.Root>) {
  return (
    <RadixRadioGroup.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadixRadioGroup.Item>) {
  return (
    <RadixRadioGroup.Item
      data-slot="radio-group-item"
      className={cn(
        "peer aspect-square size-4 shrink-0 rounded-full border border-primary text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator
        data-slot="radio-group-indicator"
        className="relative flex h-full w-full items-center justify-center"
      >
        <Circle className="size-2.5 fill-primary-foreground" />
      </RadixRadioGroup.Indicator>
    </RadixRadioGroup.Item>
  )
}

export { RadioGroup, RadioGroupItem }
