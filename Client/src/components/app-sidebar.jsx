import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconPackage,
  IconTruck,
  IconFileInvoice,
  IconAdjustments,
  IconClipboardList,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import axios from 'axios'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    
    {
      title: "Operations",
      url: "#",
      icon: IconClipboardList,
      isActive: true,
      items: [
        {
          title: "Receipt",
          url: "/operations/receipt",
        },
        {
          title: "Delivery",
          url: "/operations/delivery",
        },
        {
          title: "Adjustment",
          url: "/operations/adjustment",
        },
      ],
    },
    {
      title: "Stock",
      url: "/stock",
      icon: IconPackage,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      items: [
        {
          title: "Suppliers",
          url: "/settings/suppliers",
        },
        {
          title: "Customers",
          url: "/settings/customers",
        },
        {
          title: "Units of Measure",
          url: "/settings/units",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const base_url = import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL || '/api'
        const res = await axios.get(`${base_url}/me`, { withCredentials: true })
        if (mounted && res?.data?.user) setUser(res.data.user)
      } catch (err) {
        // ignore - user remains null
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Invio</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
