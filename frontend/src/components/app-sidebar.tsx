import * as React from "react"
import {
  BookOpen,
  Bot,
  ChartCandlestick,
  Clock,
  Command,
  Compass,
  Frame,
  LifeBuoy,
  Map,
  Moon,
  PieChart,
  ScanHeart,
  Send,
  Settings2,
  SquareTerminal,
  Watch,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { Link } from "react-router-dom"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Explore",
      url: "#",
      icon: Compass,
      isActive: true,
      items: [
        {
          title: "Stocks",
          url: "/dashboard/explore/stocks",
        },
        {
          title: "Bonds",
          url: "/dashboard/explore/bonds",
        },
        {
          title: "Crypto",
          url: "/dashboard/explore/crypto",
        },
        {
          title: "Insurance",
          url: "/dashboard/explore/insurance",
        },
      ],
    },
    {
      title: "WatchList",
      url: "/dashboard/watchlist",
      icon: Clock,
      
    },
    {
      title: "Investments",
      url: "/dashboard/investments",
      icon: ChartCandlestick ,
      
    },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Light/Dark Mode",
    //   url: "#",
    //   icon: Moon,
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="md:h-full h-[80vh] pt-10"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className=" bg-[url(/Sidelogo.png)] bg-cover text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Chihuahua Investments</span>
                  {/* <span className="truncate text-xs">Inc</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
