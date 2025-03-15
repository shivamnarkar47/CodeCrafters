import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme,setTheme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme ? <Sun size={24} />  : <Moon size={24} />}
        {theme=="dark" ? "Dark Mode"  : "Light Mode" }
    </Button>
  )
}
