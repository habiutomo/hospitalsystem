import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Search, Download, Filter } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { format } from "date-fns";
import { MedicalRecord, Patient, Staff } from "@shared/schema";

export default function MedicalRecords() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch patients for the filter dropdown
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['/api/patients'],
  });

  // Fetch staff for reference
  const { data: staff, isLoading: loadingStaff } = useQuery({
    queryKey: ['/api/staff'],
  });

  // Fetch medical records filtered by patient if selected
  const { data: medicalRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['/api/medical-records', selectedPatient],
    queryFn: async () => {
      const url = selectedPatient 
        ? `/api/medical-records?patientId=${selectedPatient}` 
        : '/api/medical-records';
      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 400) {
            // Handle case where patient ID is required but not provided
            return [];
          }
          throw new Error("Failed to fetch medical records");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching medical records:", error);
        return [];
      }
    },
    enabled: !!selectedPatient, // Only fetch when a patient is selected
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality could be implemented here if backend supports it
    toast({
      title: "Search",
      description: "Search functionality would search through medical records",
    });
  };

  const handleExportRecords = () => {
    toast({
      title: "Export",
      description: "Records would be exported to CSV/PDF",
    });
  };

  // Utility function to find patient name by ID
  const getPatientName = (patientId: number) => {
    if (loadingPatients || !patients) return "Loading...";
    
    const patient = patients.find((p: Patient) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${patientId}`;
  };

  // Utility function to find doctor name by ID
  const getDoctorName = (staffId: number) => {
    if (loadingStaff || !staff) return "Loading...";
    
    const doctor = staff.find((s: Staff) => s.id === staffId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : `Dr. #${staffId}`;
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportRecords}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Medical Records Database
              </CardTitle>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="ml-2">Search</Button>
                </form>
                <div className="flex items-center">
                  <Select
                    value={selectedPatient}
                    onValueChange={setSelectedPatient}
                  >
                    <SelectTrigger className="w-full md:w-[220px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by patient" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {loadingPatients ? (
                        <div className="p-2">Loading patients...</div>
                      ) : (
                        <>
                          <SelectItem value="">All Patients</SelectItem>
                          {patients?.map((patient: Patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.firstName} {patient.lastName} - {patient.medicalRecordNumber}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRecords || (selectedPatient === "" && !medicalRecords) ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-full max-w-md" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-2">
                    <Skeleton className="h-12 flex-grow" />
                  </div>
                ))}
              </div>
            ) : medicalRecords?.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPatient ? "This patient has no medical records." : "Please select a patient to view their medical records."}
                </p>
                <Button className="mt-4">Create New Record</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Follow-Up</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecords.map((record: MedicalRecord) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{getPatientName(record.patientId)}</TableCell>
                        <TableCell>{getDoctorName(record.staffId)}</TableCell>
                        <TableCell>{record.diagnosis || "—"}</TableCell>
                        <TableCell>
                          {record.treatment ? (
                            <div className="max-w-xs truncate" title={record.treatment}>
                              {record.treatment}
                            </div>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {record.followUpDate ? (
                            <Badge variant="outline" className="bg-blue-50">
                              {formatDate(record.followUpDate)}
                            </Badge>
                          ) : "None"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Record</DropdownMenuItem>
                              <DropdownMenuItem>Print Record</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
