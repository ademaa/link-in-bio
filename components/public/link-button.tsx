import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface LinkButtonProps {
  title: string
  url: string
}

export default function LinkButton({ title, url }: LinkButtonProps) {
  const isEmail = url.startsWith("mailto:")

  return (
    <Button
      variant="outline"
      className="w-full h-14 text-lg justify-between bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md group"
      asChild
    >
      <a href={url} target={isEmail ? "_self" : "_blank"} rel={isEmail ? "" : "noopener noreferrer"}>
        <span className="truncate text-left">{title}</span>
        <ExternalLink className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </a>
    </Button>
  )
}
