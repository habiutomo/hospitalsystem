import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBackground: string;
  title: string;
  value: string | number;
  linkText: string;
  linkHref: string;
  linkColor?: string;
}

export function StatCard({
  icon: Icon,
  iconBackground,
  title,
  value,
  linkText,
  linkHref,
  linkColor = "text-primary-600 hover:text-primary-500"
}: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBackground)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-bold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <div className={cn("font-medium cursor-pointer", linkColor)}>
              {linkText}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
