import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HospitalStat } from "@shared/schema";

interface StatItemProps {
  title: string;
  value: string | number;
  unit: string;
  change: number;
  changeText?: string;
}

function StatItem({ title, value, unit, change, changeText }: StatItemProps) {
  let changeIcon;
  let changeColor;
  
  if (change > 0) {
    changeIcon = <ArrowUp className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500" />;
    changeColor = "bg-green-100 text-green-800";
  } else if (change < 0) {
    changeIcon = <ArrowDown className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500" />;
    changeColor = "bg-red-100 text-red-800";
  } else {
    changeIcon = <Minus className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-yellow-500" />;
    changeColor = "bg-yellow-100 text-yellow-800";
  }

  return (
    <div className="bg-gray-50 overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          {title}
        </dt>
        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-primary">
            {value}
            <span className="ml-2 text-sm font-medium text-gray-500">
              {unit}
            </span>
          </div>
          <div className={`${changeColor} inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0`}>
            {changeIcon}
            <span className="sr-only">{change >= 0 ? "Increased by" : "Decreased by"}</span>
            {changeText || Math.abs(change)}
            {!changeText && (change !== 0 ? "%" : "")}
          </div>
        </dd>
      </div>
    </div>
  );
}

export function HospitalStats() {
  const { data: stats, isLoading, error } = useQuery<HospitalStat>({
    queryKey: ['/api/hospital-stats'],
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Hospital Statistics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <Skeleton className="h-4 w-24" />
                  <div className="mt-1 flex items-baseline justify-between md:block lg:flex">
                    <div className="flex items-baseline">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="ml-2 h-4 w-12" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">Error loading hospital statistics</div>
      </div>
    );
  }

  const occupancyRate = Math.round((stats.occupiedBeds / stats.totalBeds) * 100);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Hospital Statistics</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StatItem
            title="Bed Occupancy"
            value={`${occupancyRate}%`}
            unit={`of ${stats.totalBeds} beds`}
            change={3}
          />
          <StatItem
            title="Average Stay"
            value={stats.avgStayDuration}
            unit="days"
            change={-0.4}
            changeText="0.4"
          />
          <StatItem
            title="Emergency Visits"
            value={stats.emergencyVisits}
            unit="today"
            change={12}
          />
          <StatItem
            title="Surgeries Scheduled"
            value={stats.scheduledSurgeries}
            unit="today"
            change={0}
          />
        </div>
      </div>
    </div>
  );
}
