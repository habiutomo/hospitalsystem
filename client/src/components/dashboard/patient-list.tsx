import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/constants";
import { Patient } from "@shared/schema";

export function PatientList() {
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['/api/patients/recent'],
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recently Added Patients</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {[...Array(3)].map((_, i) => (
            <li key={i}>
              <div className="px-6 py-4 flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 px-6 py-3">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading recent patients: {(error as Error).message}</div>;
  }

  const isNewPatient = (registrationDate: Date): boolean => {
    const now = new Date();
    const patientDate = new Date(registrationDate);
    const diffTime = Math.abs(now.getTime() - patientDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const getTimeAgo = (registrationDate: Date): string => {
    const now = new Date();
    const patientDate = new Date(registrationDate);
    const diffTime = Math.abs(now.getTime() - patientDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recently Added Patients</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {patients?.map((patient: Patient) => (
          <li key={patient.id}>
            <div className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{`${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                    <p className="text-sm text-gray-500">
                      ID: {patient.medicalRecordNumber} • Admitted: {getTimeAgo(patient.registrationDate)}
                    </p>
                  </div>
                  {isNewPatient(patient.registrationDate) && (
                    <div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 px-6 py-3">
        <Link href={ROUTES.PATIENTS}>
          <a className="text-sm font-medium text-primary hover:text-primary-dark">
            View all patients
          </a>
        </Link>
      </div>
    </div>
  );
}
