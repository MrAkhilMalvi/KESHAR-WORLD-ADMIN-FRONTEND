import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/shared/components/ui/tooltip"
import { Info } from "lucide-react"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { ChangeEvent } from "react"

type FieldWithTooltipProps = {
  label: string
  value?: string | number
  info: string
  // Allow react-hook-form's register fields
  register?: any
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FieldWithTooltip({
  label,
  value,
  onChange,
  register,
  info,
}: FieldWithTooltipProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-sm">
              {info}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Spread either register() or fallback to manual onChange */}
      <Input
        type="number"
        value={value}
        {...(register ?? { onChange })}
      />
    </div>
  )
}
