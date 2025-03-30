import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, UserCog, Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Staff } from "@shared/schema";

export default function StaffManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['/api/staff'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for staff: ${searchQuery}`,
    });
  };

  const handleAddStaff = () => {
    toast({
      title: "Add Staff",
      description: "This would open a form to add new staff",
    });
  };

  // Filter staff by role for tabs
  const filterStaffByRole = (role: string) => {
    if (!staff) return [];
    if (role === "all") return staff;
    
    return staff.filter((s: Staff) => 
      s.role.toLowerCase() === role.toLowerCase()
    );
  };

  const renderStaffList = (filteredStaff: Staff[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <div className="text-red-500">Error loading staff: {(error as Error).message}</div>
        </div>
      );
    }

    if (!filteredStaff.length) {
      return (
        <div className="text-center py-10">
          <UserCog className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No staff found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no staff members in this category
          </p>
          <Button className="mt-4" onClick={handleAddStaff}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Staff
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staffMember: Staff) => (
          <Card key={staffMember.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {staffMember.firstName.charAt(0)}{staffMember.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {staffMember.role === "Doctor" ? "Dr." : ""} {staffMember.firstName} {staffMember.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{staffMember.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Staff</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {staffMember.specialization && (
                <Badge variant="secondary" className="mt-2">
                  {staffMember.specialization}
                </Badge>
              )}

              <div className="mt-4 space-y-2">
                {staffMember.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{staffMember.email}</span>
                  </div>
                )}
                {staffMember.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{staffMember.phoneNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                Hospital Staff
              </CardTitle>
              <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="ml-2">Search</Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All Staff</TabsTrigger>
                <TabsTrigger value="doctor">Doctors</TabsTrigger>
                <TabsTrigger value="nurse">Nurses</TabsTrigger>
                <TabsTrigger value="administrator">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {renderStaffList(filterStaffByRole("all"))}
              </TabsContent>
              <TabsContent value="doctor">
                {renderStaffList(filterStaffByRole("doctor"))}
              </TabsContent>
              <TabsContent value="nurse">
                {renderStaffList(filterStaffByRole("nurse"))}
              </TabsContent>
              <TabsContent value="administrator">
                {renderStaffList(filterStaffByRole("administrator"))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
