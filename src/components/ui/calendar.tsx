import * as React from "react"
import { Calendar as CalendarPrimitive } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof CalendarPrimitive>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <CalendarPrimitive
      className={cn(
        "p-3",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "hidden relative h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:opacity-50 data-[month=prev]:sm:block",
          "peer-[.rdp-day_selected]:opacity-100"
        ),
        nav_icon: "stroke-[2px]",
        day: cn(
          "h-7 w-7 p-0 font-normal aria-selected:opacity-100",
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          "hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50",
          "rdp-day_today:text-primary"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-secondary aria-selected:text-secondary-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
