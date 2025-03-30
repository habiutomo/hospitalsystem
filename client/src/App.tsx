import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients/index";
import NewPatient from "@/pages/patients/new";
import PatientDetails from "@/pages/patients/[id]";
import Appointments from "@/pages/appointments/index";
import NewAppointment from "@/pages/appointments/new";
import MedicalRecords from "@/pages/medical-records/index";
import StaffManagement from "@/pages/staff/index";
import Reports from "@/pages/reports/index";
import Settings from "@/pages/settings";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/patients" component={Patients} />
            <Route path="/patients/new" component={NewPatient} />
            <Route path="/patients/:id" component={PatientDetails} />
            <Route path="/appointments" component={Appointments} />
            <Route path="/appointments/new" component={NewAppointment} />
            <Route path="/medical-records" component={MedicalRecords} />
            <Route path="/staff" component={StaffManagement} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
