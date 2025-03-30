export const APP_NAME = "SIMRS";

export const ROUTES = {
  DASHBOARD: "/",
  PATIENTS: "/patients",
  NEW_PATIENT: "/patients/new",
  PATIENT_DETAILS: (id: number) => `/patients/${id}`,
  APPOINTMENTS: "/appointments",
  NEW_APPOINTMENT: "/appointments/new",
  MEDICAL_RECORDS: "/medical-records",
  STAFF: "/staff",
  REPORTS: "/reports",
  SETTINGS: "/settings",
};

export const STATUS_COLORS = {
  Confirmed: {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  Completed: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  Canceled: {
    bg: "bg-red-100",
    text: "text-red-800",
  },
  Waiting: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  Rescheduled: {
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
};

export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const GENDERS = ["Male", "Female", "Other"];

export const APPOINTMENT_STATUS = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "Canceled",
  "Waiting",
  "Rescheduled",
];

export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics and Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology",
];

export const STAFF_ROLES = [
  "Doctor",
  "Nurse",
  "Administrator",
  "Receptionist",
  "Lab Technician",
  "Pharmacist",
];
