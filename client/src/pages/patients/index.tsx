import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/constants";
import { Plus, Search } from "lucide-react";
import { Patient } from "@shared/schema";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['/api/patients', searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/patients?q=${encodeURIComponent(searchQuery)}` 
        : '/api/patients';
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch patients");
      return res.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is triggered automatically by the dependency array in useQuery
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: string | Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <Link href={ROUTES.NEW_PATIENT}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Button>
          </Link>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSearch} className="flex w-full md:max-w-sm">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="ml-2">Search</Button>
          </form>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="py-3">
                    <Skeleton className="h-6 w-full max-w-3xl" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 text-red-500">
              Error loading patients: {(error as Error).message}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients?.length > 0 ? (
                    patients.map((patient: Patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{`${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`}</AvatarFallback>
                            </Avatar>
                            {patient.firstName} {patient.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{patient.medicalRecordNumber}</TableCell>
                        <TableCell>{calculateAge(patient.dateOfBirth)}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{formatDate(patient.registrationDate)}</TableCell>
                        <TableCell>{patient.phoneNumber}</TableCell>
                        <TableCell>
                          <Link href={ROUTES.PATIENT_DETAILS(patient.id)}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
