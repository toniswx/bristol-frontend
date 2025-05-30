"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative ring-[1px]  ring-border rounded-lg px-3 py-3 text-start text-muted-foreground data-[state=checked]:ring-1 data-[state=checked]:ring-primary data-[state=checked]:text-primary text-xs  ",
        className
      )}
      {...props}
    >
      {props.value}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
