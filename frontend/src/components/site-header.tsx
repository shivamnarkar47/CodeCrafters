import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { useLocation } from "react-router-dom"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
const location = useLocation()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 py-2">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onPress={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>{location.pathname.split("/")[2]}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={location.pathname.split("/")[2] === undefined ? "hidden" : "block"} />
            <BreadcrumbItem>
              <BreadcrumbLink >{location.pathname.split("/")[3]}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Separator orientation="vertical" className="mr-2 h-4" />
       
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <Separator orientation="vertical"/>
        <ModeToggle/>
                
        
      </div>
    </header>
  )
}
