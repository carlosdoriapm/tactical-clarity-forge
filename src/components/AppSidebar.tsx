
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  Activity, 
  Book, 
  Code, 
  User, 
  Ghost,
  LayoutDashboard
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "War Logs", url: "/war-logs", icon: Book },
  { title: "Rituals", url: "/rituals", icon: Activity },
  { title: "War Code", url: "/war-code", icon: Code },
  { title: "Profile", url: "/profile", icon: User },
]

const lockedItems = [
  { title: "GHOST Mode", url: "/ghost", icon: Ghost, locked: true },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  const getNavClassName = (isActive: boolean, locked = false) => {
    if (locked) {
      return "opacity-50 cursor-not-allowed"
    }
    return isActive 
      ? "bg-warfare-accent text-white font-medium" 
      : "text-warfare-gray hover:bg-warfare-accent/20 hover:text-white"
  }

  return (
    <Sidebar className="border-r border-warfare-gray/20 bg-warfare-dark">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-warfare-accent font-bold text-lg mb-4">
            {!collapsed && "WARFARE COUNSELOR"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(isActive(item.url))}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {lockedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    disabled
                    className={getNavClassName(false, true)}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && (
                      <span className="ml-3 flex items-center">
                        {item.title}
                        <span className="ml-2 text-xs bg-warfare-gray/20 px-2 py-1 rounded">
                          LOCKED
                        </span>
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
