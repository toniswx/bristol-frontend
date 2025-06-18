import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Component() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Dark
          </Button>
        </TooltipTrigger>
        <TooltipContent className="dark px-2 py-1 text-xs">
          This tooltip will be always dark
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
