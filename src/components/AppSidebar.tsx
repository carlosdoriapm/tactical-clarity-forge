
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  User,
  MessageSquare,
  LayoutDashboard
} from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation";

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

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const { t } = useTranslation();

  const navigationItems = [
    { title: t('dashboard'), url: "/", icon: LayoutDashboard },
    { title: t('chat'), url: "/chat", icon: MessageSquare },
    { title: t('profile'), url: "/profile", icon: User },
  ]

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
