import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ROUTES, STATUS_COLORS } from "@/lib/constants";
import { ArrowLeft, Calendar, Clock, FileText, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Patient, Appointment, MedicalRecord } from "@shared/schema";

export default function PatientDetails() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const patientId = parseInt(params.id);

  const { data: patient, isLoading: isLoadingPatient, error: patientError } = useQuery<Patient>({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !isNaN(patientId),
  });

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: [`/api/appointments`, patientId],
    queryFn: async () => {
      const res = await fetch(`/api/appointments?patientId=${patientId}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
    enabled: !isNaN(patientId),
  });

  const { data: medicalRecords, isLoading: isLoadingMedicalRecords } = useQuery<MedicalRecord[]>({
    queryKey: [`/api/medical-records`, patientId],
    queryFn: async () => {
      const res = await fetch(`/api/medical-records?patientId=${patientId}`);
      if (!res.ok) throw new Error("Failed to fetch medical records");
      return res.json();
    },
    enabled: !isNaN(patientId),
  });

  const deletePatientMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/patients/${patientId}`, undefined);
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      await queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      navigate(ROUTES.PATIENTS);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete patient: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeletePatient = () => {
    if (confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      deletePatientMutation.mutate();
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: string | Date | undefined) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoadingPatient) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading patient</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{(patientError as Error)?.message || "Patient not found"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => navigate(ROUTES.PATIENTS)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PATIENTS)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 ml-2">
              Patient: {patient.firstName} {patient.lastName}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/patients/edit/${patientId}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDeletePatient}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="text-lg">{`${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                ID: {patient.medicalRecordNumber} • {patient.gender}, {calculateAge(patient.dateOfBirth)} years old
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.firstName} {patient.lastName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Medical Record Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.medicalRecordNumber}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.gender}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.bloodType || "Not specified"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>{patient.phoneNumber || "No phone number"}</p>
                  <p>{patient.email || "No email"}</p>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.address || "No address provided"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patient.emergencyContact ? (
                    <>
                      <p>{patient.emergencyContact}</p>
                      <p>{patient.emergencyPhone || "No emergency phone"}</p>
                    </>
                  ) : (
                    "No emergency contact provided"
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(patient.registrationDate)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <Tabs defaultValue="appointments" className="mt-6">
          <TabsList>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="medical-records" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Medical Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>All appointments for this patient</CardDescription>
                  </div>
                  <Button onClick={() => navigate(ROUTES.NEW_APPOINTMENT)}>
                    Schedule Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{formatDate(appointment.date)}</TableCell>
                          <TableCell>
                            {new Date(appointment.time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </TableCell>
                          <TableCell>
                            {/* We'd need to fetch staff names in a real app */}
                            Dr. ID: {appointment.staffId}
                          </TableCell>
                          <TableCell>{appointment.reason || "General checkup"}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`${
                                STATUS_COLORS[appointment.status as keyof typeof STATUS_COLORS]?.bg
                              } ${
                                STATUS_COLORS[appointment.status as keyof typeof STATUS_COLORS]?.text
                              }`}
                            >
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No appointments found for this patient.
                    <div className="mt-4">
                      <Button onClick={() => navigate(ROUTES.NEW_APPOINTMENT)}>
                        Schedule First Appointment
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical-records" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Patient's medical history</CardDescription>
                  </div>
                  <Button>Add Medical Record</Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingMedicalRecords ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : medicalRecords && medicalRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Treatment</TableHead>
                        <TableHead>Follow-up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicalRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>
                            {/* We'd need to fetch staff names in a real app */}
                            Dr. ID: {record.staffId}
                          </TableCell>
                          <TableCell>{record.diagnosis || "N/A"}</TableCell>
                          <TableCell>{record.treatment || "N/A"}</TableCell>
                          <TableCell>{record.followUpDate ? formatDate(record.followUpDate) : "None"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No medical records found for this patient.
                    <div className="mt-4">
                      <Button>
                        Add First Medical Record
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
