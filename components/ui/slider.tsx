"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation={orientation}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-disabled:opacity-50",
        orientation === "vertical"
          ? "h-full min-h-40 w-auto flex-col"
          : "flex-row",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-zinc-200",
          orientation === "vertical" ? "h-full w-1.5" : "h-1.5 w-full"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-zinc-900",
            orientation === "vertical" ? "w-full" : "h-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative block size-4 shrink-0 rounded-full border border-zinc-300 bg-white shadow-md transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-2 hover:ring-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none active:ring-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };