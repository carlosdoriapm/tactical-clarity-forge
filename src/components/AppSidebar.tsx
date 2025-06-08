
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  User,
  MessageSquare
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
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Profile", url: "/profile", icon: User },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  const getNavClassName = (isActive: boolean) => {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
