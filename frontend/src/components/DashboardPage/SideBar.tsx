import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
const SideBar = () => {
  return (
    <div>   
        <SidebarProvider className="flex flex-col">
    <SiteHeader />
    <div className="flex flex-1">
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
         <Outlet/>
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider></div>
  )
}

export default SideBar