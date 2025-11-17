import {
  Users,
  X,
  Music,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Cookies from "js-cookie";
import { TLSSocket } from "tls";
import { useRouter } from "next/navigation";

export default function Sidebar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const navItems = [
    { icon: Music, label: "Dashboard", active: true },
    { icon: Users, label: "My Rooms", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const footerItems = [
    { icon: HelpCircle, label: "help" },
    { icon: LogOut, label: "Logout" },
  ];

  const onHandleClick = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <aside
      className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 lg:w-64
        bg-sidebar border-r border-white/10 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <img src="./audiyn.png" alt="" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Audiyn
            </span>
          </div>
          {/* Close button only visible on mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-white/10 text-white"
                : "text-sidebar-foreground hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        {footerItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-white/5 transition-all duration-200"
            onClick={onHandleClick}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
