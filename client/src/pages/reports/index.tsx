import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  Download, 
  Calendar, 
  Printer,
  Users,
  FileText,
  Activity,
  Clock,
  Bed
} from "lucide-react";
import { format, subMonths } from "date-fns";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart
} from "recharts";

// Sample data for charts
const admissionsData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 40 },
];

const appointmentsByDepartment = [
  { name: 'Cardiology', value: 35 },
  { name: 'Neurology', value: 20 },
  { name: 'Dermatology', value: 15 },
  { name: 'Pediatrics', value: 25 },
  { name: 'Orthopedics', value: 18 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<string>("last30days");
  const [reportType, setReportType] = useState<string>("patient");

  // Fetching hospital statistics
  const { data: hospitalStats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/hospital-stats'],
  });
  
  const handleExportReport = () => {
    toast({
      title: "Export Report",
      description: "Report would be exported to PDF/CSV",
    });
  };

  const handlePrintReport = () => {
    toast({
      title: "Print Report",
      description: "Report would be sent to printer",
    });
  };

  // Get date string based on selected range
  const getDateRangeString = () => {
    const today = new Date();
    
    switch (dateRange) {
      case "last7days":
        return `${format(subMonths(today, 0).setDate(today.getDate() - 7), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
      case "last30days":
        return `${format(subMonths(today, 1), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
      case "last3months":
        return `${format(subMonths(today, 3), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
      case "last6months":
        return `${format(subMonths(today, 6), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
      case "lastyear":
        return `${format(subMonths(today, 12), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
      default:
        return `${format(subMonths(today, 1), "MMM d, yyyy")} - ${format(today, "MMM d, yyyy")}`;
    }
  };

  const renderPatientStatistics = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <h3 className="text-2xl font-semibold">1,543</h3>
                  <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">New Patients</p>
                  <h3 className="text-2xl font-semibold">154</h3>
                  <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Medical Records</p>
                  <h3 className="text-2xl font-semibold">2,831</h3>
                  <p className="text-sm text-green-600 mt-1">↑ 8% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Admissions</CardTitle>
              <CardDescription>Monthly patient admissions for the past 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={admissionsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Patients" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Demographics</CardTitle>
              <CardDescription>Patient distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={appointmentsByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Activity</CardTitle>
            <CardDescription>Latest patient registrations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead>Last Appointment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>P-0012345</TableCell>
                  <TableCell>Linda Barnes</TableCell>
                  <TableCell>Jan 10, 2023</TableCell>
                  <TableCell>Today, 9:30 AM</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P-0012346</TableCell>
                  <TableCell>Robert Chen</TableCell>
                  <TableCell>Jan 15, 2023</TableCell>
                  <TableCell>Today, 10:15 AM</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P-0012347</TableCell>
                  <TableCell>James Wilson</TableCell>
                  <TableCell>Jan 20, 2023</TableCell>
                  <TableCell>Today, 11:00 AM</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P-0012348</TableCell>
                  <TableCell>Emily Taylor</TableCell>
                  <TableCell>Yesterday</TableCell>
                  <TableCell>Yesterday, 2:00 PM</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P-0012349</TableCell>
                  <TableCell>David Kim</TableCell>
                  <TableCell>5 hours ago</TableCell>
                  <TableCell>Not yet scheduled</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      New
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderHospitalStatistics = () => {
    if (loadingStats) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-4">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bed Occupancy</p>
                  <h3 className="text-2xl font-semibold">
                    {hospitalStats ? `${Math.round((hospitalStats.occupiedBeds / hospitalStats.totalBeds) * 100)}%` : '—'}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">↑ 3% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Stay Duration</p>
                  <h3 className="text-2xl font-semibold">
                    {hospitalStats ? `${hospitalStats.avgStayDuration} days` : '—'}
                  </h3>
                  <p className="text-sm text-red-600 mt-1">↓ 0.4 from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-4">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Visits</p>
                  <h3 className="text-2xl font-semibold">
                    {hospitalStats ? hospitalStats.emergencyVisits : '—'}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Admissions</CardTitle>
              <CardDescription>Patient admissions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={admissionsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Admissions" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Surgical Procedures</CardTitle>
              <CardDescription>Number of surgeries by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Cardiothoracic', value: 12 },
                        { name: 'Orthopedic', value: 18 },
                        { name: 'Neurosurgery', value: 8 },
                        { name: 'General', value: 22 },
                        { name: 'Other', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Operations Summary</CardTitle>
            <CardDescription>Key hospital metrics for {getDateRangeString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Admissions</TableCell>
                  <TableCell>387</TableCell>
                  <TableCell className="text-green-600">+5.2%</TableCell>
                  <TableCell>↗</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average Length of Stay</TableCell>
                  <TableCell>4.2 days</TableCell>
                  <TableCell className="text-red-600">-0.4 days</TableCell>
                  <TableCell>↘</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bed Utilization Rate</TableCell>
                  <TableCell>78%</TableCell>
                  <TableCell className="text-green-600">+3%</TableCell>
                  <TableCell>↗</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Emergency Department Visits</TableCell>
                  <TableCell>1,245</TableCell>
                  <TableCell className="text-green-600">+12%</TableCell>
                  <TableCell>↗</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Surgeries Performed</TableCell>
                  <TableCell>128</TableCell>
                  <TableCell className="text-gray-500">0%</TableCell>
                  <TableCell>→</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintReport}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <BarChartIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Analytics Dashboard</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <Select
                    value={dateRange}
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last3months">Last 3 months</SelectItem>
                      <SelectItem value="last6months">Last 6 months</SelectItem>
                      <SelectItem value="lastyear">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Select
                  value={reportType}
                  onValueChange={setReportType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient Statistics</SelectItem>
                    <SelectItem value="hospital">Hospital Statistics</SelectItem>
                    <SelectItem value="financial">Financial Reports</SelectItem>
                    <SelectItem value="staff">Staff Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {reportType === "patient" && renderPatientStatistics()}
            {reportType === "hospital" && renderHospitalStatistics()}
            {reportType === "financial" && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-500">Financial reports module</h3>
                <p className="text-sm text-gray-400 mt-1">This module is under development.</p>
              </div>
            )}
            {reportType === "staff" && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-500">Staff performance module</h3>
                <p className="text-sm text-gray-400 mt-1">This module is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
