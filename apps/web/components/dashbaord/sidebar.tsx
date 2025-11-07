import {
  BarChart3,
  HelpCircle,
  LogOut,
  Music,
  Settings,
  Users,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const navItems = [
    { icon: Music, label: "Dashboard", active: true },
    { icon: Users, label: "My Rooms", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const footerItems = [
    { icon: HelpCircle, label: "Help" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
    >
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <img src="./audiyn.png" alt="audiyn logo" />
          </div>
          {isOpen && (
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Audiyn
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center hover:bg-white/5 gap-3 px-4 py-3 transition duration-0.1 ease-in-out  rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground bg-white/5 "
                : "text-sidebar-foreground hover:bg-whit/10"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span className="">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        {footerItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all duration-200"
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
