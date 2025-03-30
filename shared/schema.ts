import { pgTable, text, serial, integer, boolean, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Patient table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  medicalRecordNumber: text("medical_record_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  bloodType: text("blood_type"),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
});

// Staff table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // Doctor, Nurse, Admin, etc.
  specialization: text("specialization"), // For doctors
  phoneNumber: text("phone_number"),
  email: text("email"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Appointment table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  staffId: integer("staff_id").notNull().references(() => staff.id),
  date: date("date").notNull(),
  time: time("time").notNull(),
  status: text("status").notNull(), // Scheduled, Completed, Canceled, etc.
  reason: text("reason"),
  notes: text("notes"),
});

// Medical record table
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  staffId: integer("staff_id").notNull().references(() => staff.id),
  date: timestamp("date").defaultNow().notNull(),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescription: text("prescription"),
  notes: text("notes"),
  followUpDate: date("follow_up_date"),
});

// Hospital statistics
export const hospitalStats = pgTable("hospital_stats", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  totalBeds: integer("total_beds").notNull(),
  occupiedBeds: integer("occupied_beds").notNull(),
  avgStayDuration: integer("avg_stay_duration").notNull(), // in days
  emergencyVisits: integer("emergency_visits").notNull(),
  scheduledSurgeries: integer("scheduled_surgeries").notNull(),
});

// Schemas for insertion
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true });
export const insertStaffSchema = createInsertSchema(staff).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true });
export const insertHospitalStatSchema = createInsertSchema(hospitalStats).omit({ id: true });

// Types for insertion
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type InsertHospitalStat = z.infer<typeof insertHospitalStatSchema>;

// Select types
export type Patient = typeof patients.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type HospitalStat = typeof hospitalStats.$inferSelect;

// Type for patient with appointment
export type PatientWithAppointment = Patient & {
  appointmentTime?: string;
  appointmentDate?: string;
  doctorName?: string;
  specialization?: string;
  status?: string;
};
