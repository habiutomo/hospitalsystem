import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";
import {
  Home,
  Users,
  Calendar,
  FileText,
  UserCog,
  BarChart2,
  Settings,
  Activity
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
          active
            ? "text-white bg-primary"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <div className={cn("mr-3 h-5 w-5", active ? "" : "text-gray-400")}>
          {icon}
        </div>
        {label}
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location === path;
    }
    return location.startsWith(path);
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-16 px-4 bg-primary">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">{APP_NAME}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <SidebarLink
              href={ROUTES.DASHBOARD}
              icon={<Home />}
              label="Dashboard"
              active={isActive(ROUTES.DASHBOARD)}
            />
            <SidebarLink
              href={ROUTES.PATIENTS}
              icon={<Users />}
              label="Patients"
              active={isActive(ROUTES.PATIENTS)}
            />
            <SidebarLink
              href={ROUTES.APPOINTMENTS}
              icon={<Calendar />}
              label="Appointments"
              active={isActive(ROUTES.APPOINTMENTS)}
            />
            <SidebarLink
              href={ROUTES.MEDICAL_RECORDS}
              icon={<FileText />}
              label="Medical Records"
              active={isActive(ROUTES.MEDICAL_RECORDS)}
            />
            <SidebarLink
              href={ROUTES.STAFF}
              icon={<UserCog />}
              label="Staff Management"
              active={isActive(ROUTES.STAFF)}
            />
            <SidebarLink
              href={ROUTES.REPORTS}
              icon={<BarChart2 />}
              label="Reports"
              active={isActive(ROUTES.REPORTS)}
            />
            <SidebarLink
              href={ROUTES.SETTINGS}
              icon={<Settings />}
              label="Settings"
              active={isActive(ROUTES.SETTINGS)}
            />
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</p>
              <p className="text-xs font-medium text-gray-500">Cardiologist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
