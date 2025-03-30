import { StatCard } from "@/components/dashboard/stat-card";
import { AppointmentList } from "@/components/dashboard/appointment-list";
import { PatientList } from "@/components/dashboard/patient-list";
import { HospitalStats } from "@/components/dashboard/hospital-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ROUTES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, Zap, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['/api/patients'],
  });

  const { data: appointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ['/api/appointments/today'],
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Statistics Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loadingPatients ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="ml-5 w-0 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-12 mt-1" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ) : (
            <StatCard
              icon={Users}
              iconBackground="bg-primary-500"
              title="Total Patients"
              value={patients?.length || 0}
              linkText="View all patients"
              linkHref={ROUTES.PATIENTS}
            />
          )}
          
          {loadingAppointments ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="ml-5 w-0 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-12 mt-1" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ) : (
            <StatCard
              icon={Calendar}
              iconBackground="bg-green-500"
              title="Today's Appointments"
              value={appointments?.length || 0}
              linkText="View all appointments"
              linkHref={ROUTES.APPOINTMENTS}
              linkColor="text-green-600 hover:text-green-500"
            />
          )}
          
          <StatCard
            icon={Zap}
            iconBackground="bg-yellow-500"
            title="Pending Lab Results"
            value={8}
            linkText="View pending"
            linkHref="#"
            linkColor="text-yellow-600 hover:text-yellow-500"
          />
          
          <StatCard
            icon={MessageSquare}
            iconBackground="bg-purple-500"
            title="New Messages"
            value={12}
            linkText="View all messages"
            linkHref="#"
            linkColor="text-purple-600 hover:text-purple-500"
          />
        </div>

        {/* Today's Appointments */}
        <AppointmentList />

        {/* Recent Patients & Hospital Overview */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PatientList />
          <HospitalStats />
        </div>

        {/* Quick Access Buttons */}
        <QuickActions />
      </div>
    </div>
  );
}
