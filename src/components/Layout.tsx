
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-warfare-dark">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b border-warfare-gray/20 bg-warfare-dark px-4">
            <SidebarTrigger className="text-white hover:bg-warfare-accent/20" />
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-warfare-blue hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-warfare-accent/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
