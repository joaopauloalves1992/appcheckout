import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "single"
  selected?: Date | null
  onSelect?: (date: Date | null) => void
  disabled?: (date: Date) => boolean
  defaultMonth?: Date
  month?: Date
  onMonthChange?: (date: Date) => void
  numberOfMonths?: number
  fromDate?: Date
  toDate?: Date
  captionLayout?: "buttons" | "dropdown"
  classNames?: {
    months?: string
    month?: string
    caption?: string
    caption_label?: string
    nav?: string
    nav_button?: string
    nav_button_previous?: string
    nav_button_next?: string
    table?: string
    head_row?: string
    head_cell?: string
    row?: string
    cell?: string
    day?: string
    day_selected?: string
    day_today?: string
    day_outside?: string
    day_disabled?: string
    day_range_middle?: string
    day_hidden?: string
  }
}

function Calendar({
  className,
  classNames,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        <div className="grid grid-cols-7 text-center">
          <div className="text-muted-foreground">Dom</div>
          <div className="text-muted-foreground">Seg</div>
          <div className="text-muted-foreground">Ter</div>
          <div className="text-muted-foreground">Qua</div>
          <div className="text-muted-foreground">Qui</div>
          <div className="text-muted-foreground">Sex</div>
          <div className="text-muted-foreground">Sáb</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Simplified calendar view without actual date-fns or react-day-picker */}
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                "rounded-md text-center text-sm",
                i === 14 && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
