import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import * as React from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import axios from 'axios'

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const [userInfo, setUserInfo] = React.useState(user || null)
  const [loading, setLoading] = React.useState(!user)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await axios.get('/me', { withCredentials: true })
        if (mounted && res?.data?.user) setUserInfo(res.data.user)
      } catch (err) {
        // not logged in or error — leave null
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (!user) load()
    return () => { mounted = false }
  }, [user])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={
                  userInfo?.avatar || (userInfo ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || userInfo.email || 'User')}&background=edf2f7&color=3b82f6&rounded=true` : undefined)
                } alt={userInfo?.name || 'User'} />
                <AvatarFallback className="rounded-lg">{(userInfo?.name || userInfo?.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userInfo?.name || 'Guest'}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userInfo?.email || ''}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={
                    userInfo?.avatar || (userInfo ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || userInfo.email || 'User')}&background=edf2f7&color=3b82f6&rounded=true` : undefined)
                  } alt={userInfo?.name || 'User'} />
                  <AvatarFallback className="rounded-lg">{(userInfo?.name || userInfo?.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userInfo?.name || 'Guest'}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userInfo?.email || ''}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div role="group" className="px-1">
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onSelect={async (event) => {
                // DropdownMenuItem uses onSelect; prevent default navigation behavior
                event.preventDefault()
                try {
                  await axios.post('/logout', {}, { withCredentials: true })
                } catch (err) {
                  // ignore errors
                } finally {
                  window.location.reload()
                }
              }}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
