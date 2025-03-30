import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Plus, Search, ChevronDown, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES, STATUS_COLORS } from "@/lib/constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Appointment } from "@shared/schema";

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments', dateString],
    queryFn: async () => {
      const url = `/api/appointments?date=${dateString}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
    enabled: !!dateString,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log("Searching for:", searchQuery);
  };

  // Filter appointments based on status for the status tabs
  const getFilteredAppointments = (status: string) => {
    if (!appointments) return [];
    if (status === "all") return appointments;
    
    return appointments.filter((appointment: Appointment) => 
      appointment.status.toLowerCase() === status.toLowerCase()
    );
  };

  const formatTime = (timeString: string | Date) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderAppointmentList = (filteredAppointments: Appointment[]) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-10 w-20 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!filteredAppointments.length) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-500">No appointments found</h3>
          <p className="text-sm text-gray-400 mt-1">There are no appointments scheduled for this date.</p>
          <Button className="mt-4" onClick={() => setSelectedDate(new Date())}>
            View Today's Appointments
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredAppointments.map((appointment: any) => (
          <Card key={appointment.id} className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      P{appointment.patientId}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium">Patient #{appointment.patientId}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(appointment.time)}
                      <span className="mx-2">•</span>
                      <span>Dr. #{appointment.staffId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge className={cn(
                    STATUS_COLORS[appointment.status as keyof typeof STATUS_COLORS]?.bg,
                    STATUS_COLORS[appointment.status as keyof typeof STATUS_COLORS]?.text
                  )}>
                    {appointment.status}
                  </Badge>
                  <Link href={`/appointments/${appointment.id}`}>
                    <Button variant="ghost" size="sm" className="ml-2">View</Button>
                  </Link>
                </div>
              </div>
              {appointment.reason && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Reason:</span> {appointment.reason}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />;
      case 'waiting':
        return <Clock className="h-4 w-4 mr-1 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <Link href={ROUTES.NEW_APPOINTMENT}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Appointments for {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Today"}
                </h2>
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-60"
                    />
                  </div>
                  <Button type="submit" className="ml-2">Search</Button>
                </form>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="confirmed" className="flex items-center justify-center">
                    {getStatusIcon("confirmed")}
                    Confirmed
                  </TabsTrigger>
                  <TabsTrigger value="waiting" className="flex items-center justify-center">
                    {getStatusIcon("waiting")}
                    Waiting
                  </TabsTrigger>
                  <TabsTrigger value="canceled" className="flex items-center justify-center">
                    {getStatusIcon("canceled")}
                    Canceled
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {renderAppointmentList(getFilteredAppointments("all"))}
                </TabsContent>
                <TabsContent value="confirmed">
                  {renderAppointmentList(getFilteredAppointments("confirmed"))}
                </TabsContent>
                <TabsContent value="waiting">
                  {renderAppointmentList(getFilteredAppointments("waiting"))}
                </TabsContent>
                <TabsContent value="canceled">
                  {renderAppointmentList(getFilteredAppointments("canceled"))}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Appointment Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Waiting</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Canceled</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href={ROUTES.NEW_APPOINTMENT}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Appointment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
