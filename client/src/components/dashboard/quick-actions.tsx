import { Link } from "wouter";
import { Users, Calendar, FileText, BarChart2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

function QuickAction({ icon, title, description, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <a className="block bg-white shadow rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200">
        <div className="p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
              {icon}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="mt-8">
      <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          icon={<Users className="h-6 w-6 text-primary-600" />}
          title="Register New Patient"
          description="Create a new patient record"
          href={ROUTES.NEW_PATIENT}
          color="bg-primary-100"
        />
        <QuickAction
          icon={<Calendar className="h-6 w-6 text-green-600" />}
          title="Schedule Appointment"
          description="Book a new appointment"
          href={ROUTES.NEW_APPOINTMENT}
          color="bg-green-100"
        />
        <QuickAction
          icon={<FileText className="h-6 w-6 text-purple-600" />}
          title="Medical Records"
          description="Access patient records"
          href={ROUTES.MEDICAL_RECORDS}
          color="bg-purple-100"
        />
        <QuickAction
          icon={<BarChart2 className="h-6 w-6 text-yellow-600" />}
          title="Reports"
          description="Generate hospital reports"
          href={ROUTES.REPORTS}
          color="bg-yellow-100"
        />
      </div>
    </div>
  );
}
