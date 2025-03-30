import { 
  patients, medicalRecords, staff, appointments, hospitalStats,
  type Patient, type Staff, type Appointment, type MedicalRecord, type HospitalStat,
  type InsertPatient, type InsertStaff, type InsertAppointment, type InsertMedicalRecord, type InsertHospitalStat,
  type PatientWithAppointment
} from "@shared/schema";

export interface IStorage {
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByMRN(mrn: string): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<Patient>): Promise<Patient | undefined>;
  deletePatient(id: number): Promise<boolean>;
  searchPatients(query: string): Promise<Patient[]>;
  getRecentPatients(limit: number): Promise<Patient[]>;

  // Staff operations
  getStaff(id: number): Promise<Staff | undefined>;
  getStaffByUsername(username: string): Promise<Staff | undefined>;
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<Staff>): Promise<Staff | undefined>;
  deleteStaff(id: number): Promise<boolean>;
  getDoctors(): Promise<Staff[]>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  getAppointmentsByStaff(staffId: number): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getTodayAppointments(): Promise<PatientWithAppointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Medical Record operations
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<MedicalRecord>): Promise<MedicalRecord | undefined>;
  deleteMedicalRecord(id: number): Promise<boolean>;
  
  // Hospital statistics operations
  getHospitalStats(date: string): Promise<HospitalStat | undefined>;
  getLatestHospitalStats(): Promise<HospitalStat | undefined>;
  updateHospitalStats(date: string, stats: Partial<HospitalStat>): Promise<HospitalStat | undefined>;
  createHospitalStats(stats: InsertHospitalStat): Promise<HospitalStat>;
}

export class MemStorage implements IStorage {
  private patients: Map<number, Patient>;
  private staff: Map<number, Staff>;
  private appointments: Map<number, Appointment>;
  private medicalRecords: Map<number, MedicalRecord>;
  private hospitalStats: Map<string, HospitalStat>;
  
  private patientId: number;
  private staffId: number;
  private appointmentId: number;
  private medicalRecordId: number;
  private hospitalStatId: number;

  constructor() {
    this.patients = new Map();
    this.staff = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.hospitalStats = new Map();
    
    this.patientId = 1;
    this.staffId = 1;
    this.appointmentId = 1;
    this.medicalRecordId = 1;
    this.hospitalStatId = 1;

    // Initialize with some mock data for demo purposes
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add sample staff
    const drSarah: InsertStaff = {
      firstName: "Sarah",
      lastName: "Johnson",
      role: "Doctor",
      specialization: "Cardiology",
      phoneNumber: "555-123-4567",
      email: "sarah.johnson@hospital.com",
      username: "sarah.johnson",
      password: "password123",
    };
    this.createStaff(drSarah);

    const drMichael: InsertStaff = {
      firstName: "Michael",
      lastName: "Lee",
      role: "Doctor",
      specialization: "Neurology",
      phoneNumber: "555-234-5678",
      email: "michael.lee@hospital.com",
      username: "michael.lee",
      password: "password123",
    };
    this.createStaff(drMichael);

    const drRachel: InsertStaff = {
      firstName: "Rachel",
      lastName: "Green",
      role: "Doctor",
      specialization: "Dermatology",
      phoneNumber: "555-345-6789",
      email: "rachel.green@hospital.com",
      username: "rachel.green",
      password: "password123",
    };
    this.createStaff(drRachel);

    // Add sample patients
    const lindaBarnes: InsertPatient = {
      medicalRecordNumber: "P-0012345",
      firstName: "Linda",
      lastName: "Barnes",
      dateOfBirth: new Date("1980-05-15"),
      gender: "Female",
      phoneNumber: "555-987-6543",
      email: "linda.barnes@example.com",
      address: "123 Main St, Anytown, USA",
      emergencyContact: "John Barnes",
      emergencyPhone: "555-987-6544",
      bloodType: "A+",
      registrationDate: new Date("2023-01-10"),
    };
    const patient1 = this.createPatient(lindaBarnes);

    const robertChen: InsertPatient = {
      medicalRecordNumber: "P-0012346",
      firstName: "Robert",
      lastName: "Chen",
      dateOfBirth: new Date("1975-08-22"),
      gender: "Male",
      phoneNumber: "555-876-5432",
      email: "robert.chen@example.com",
      address: "456 Oak Ave, Anytown, USA",
      emergencyContact: "Susan Chen",
      emergencyPhone: "555-876-5433",
      bloodType: "B-",
      registrationDate: new Date("2023-01-15"),
    };
    const patient2 = this.createPatient(robertChen);

    const jamesWilson: InsertPatient = {
      medicalRecordNumber: "P-0012347",
      firstName: "James",
      lastName: "Wilson",
      dateOfBirth: new Date("1990-03-10"),
      gender: "Male",
      phoneNumber: "555-765-4321",
      email: "james.wilson@example.com",
      address: "789 Pine St, Anytown, USA",
      emergencyContact: "Emma Wilson",
      emergencyPhone: "555-765-4322",
      bloodType: "O+",
      registrationDate: new Date("2023-01-20"),
    };
    const patient3 = this.createPatient(jamesWilson);

    const emilyTaylor: InsertPatient = {
      medicalRecordNumber: "P-0012348",
      firstName: "Emily",
      lastName: "Taylor",
      dateOfBirth: new Date("1985-11-27"),
      gender: "Female",
      phoneNumber: "555-654-3210",
      email: "emily.taylor@example.com",
      address: "321 Elm St, Anytown, USA",
      emergencyContact: "Mark Taylor",
      emergencyPhone: "555-654-3211",
      bloodType: "AB+",
      registrationDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    };
    const patient4 = this.createPatient(emilyTaylor);

    const davidKim: InsertPatient = {
      medicalRecordNumber: "P-0012349",
      firstName: "David",
      lastName: "Kim",
      dateOfBirth: new Date("1982-07-08"),
      gender: "Male",
      phoneNumber: "555-543-2109",
      email: "david.kim@example.com",
      address: "654 Maple St, Anytown, USA",
      emergencyContact: "Sophia Kim",
      emergencyPhone: "555-543-2110",
      bloodType: "A-",
      registrationDate: new Date(new Date().setHours(new Date().getHours() - 5)),
    };
    const patient5 = this.createPatient(davidKim);

    const mariaRodriguez: InsertPatient = {
      medicalRecordNumber: "P-0012350",
      firstName: "Maria",
      lastName: "Rodriguez",
      dateOfBirth: new Date("1988-09-14"),
      gender: "Female",
      phoneNumber: "555-432-1098",
      email: "maria.rodriguez@example.com",
      address: "987 Cedar St, Anytown, USA",
      emergencyContact: "Carlos Rodriguez",
      emergencyPhone: "555-432-1099",
      bloodType: "O-",
      registrationDate: new Date(new Date().setHours(new Date().getHours() - 2)),
    };
    const patient6 = this.createPatient(mariaRodriguez);

    // Add sample appointments
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const appointment1: InsertAppointment = {
      patientId: patient1.id,
      staffId: 1, // Dr. Sarah
      date: today,
      time: new Date(`${todayStr}T09:30:00`),
      status: "Confirmed",
      reason: "Annual checkup",
      notes: "Patient has history of hypertension",
    };
    this.createAppointment(appointment1);

    const appointment2: InsertAppointment = {
      patientId: patient2.id,
      staffId: 2, // Dr. Michael
      date: today,
      time: new Date(`${todayStr}T10:15:00`),
      status: "Waiting",
      reason: "Headache consultation",
      notes: "Patient reports frequent migraines",
    };
    this.createAppointment(appointment2);

    const appointment3: InsertAppointment = {
      patientId: patient3.id,
      staffId: 3, // Dr. Rachel
      date: today,
      time: new Date(`${todayStr}T11:00:00`),
      status: "Confirmed",
      reason: "Skin rash examination",
      notes: "Patient has allergic reactions to certain medications",
    };
    this.createAppointment(appointment3);

    // Add some medical records
    const medicalRecord1: InsertMedicalRecord = {
      patientId: patient1.id,
      staffId: 1,
      date: new Date(new Date().setDate(new Date().getDate() - 30)),
      diagnosis: "Hypertension",
      treatment: "Prescribed Lisinopril 10mg daily",
      prescription: "Lisinopril 10mg, 30 tablets, take 1 tablet daily",
      notes: "Patient advised to reduce salt intake and exercise regularly",
      followUpDate: new Date(new Date().setDate(new Date().getDate() + 60)),
    };
    this.createMedicalRecord(medicalRecord1);

    // Add hospital statistics
    const stats: InsertHospitalStat = {
      date: today,
      totalBeds: 320,
      occupiedBeds: 250,
      avgStayDuration: 4,
      emergencyVisits: 42,
      scheduledSurgeries: 8,
    };
    this.createHospitalStats(stats);
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByMRN(mrn: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.medicalRecordNumber === mrn
    );
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const newPatient: Patient = { ...patient, id };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  async updatePatient(id: number, patientData: Partial<Patient>): Promise<Patient | undefined> {
    const patient = await this.getPatient(id);
    if (!patient) {
      return undefined;
    }
    
    const updatedPatient: Patient = { ...patient, ...patientData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async deletePatient(id: number): Promise<boolean> {
    return this.patients.delete(id);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    if (!query) {
      return this.getAllPatients();
    }
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(lowerQuery) ||
        patient.lastName.toLowerCase().includes(lowerQuery) ||
        patient.medicalRecordNumber.toLowerCase().includes(lowerQuery) ||
        (patient.email && patient.email.toLowerCase().includes(lowerQuery))
    );
  }

  async getRecentPatients(limit: number): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  // Staff operations
  async getStaff(id: number): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async getStaffByUsername(username: string): Promise<Staff | undefined> {
    return Array.from(this.staff.values()).find(
      (staff) => staff.username === username
    );
  }

  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const id = this.staffId++;
    const newStaff: Staff = { ...staffData, id };
    this.staff.set(id, newStaff);
    return newStaff;
  }

  async updateStaff(id: number, staffData: Partial<Staff>): Promise<Staff | undefined> {
    const staff = await this.getStaff(id);
    if (!staff) {
      return undefined;
    }
    
    const updatedStaff: Staff = { ...staff, ...staffData };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<boolean> {
    return this.staff.delete(id);
  }

  async getDoctors(): Promise<Staff[]> {
    return Array.from(this.staff.values()).filter(
      (staff) => staff.role === "Doctor"
    );
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  async getAppointmentsByStaff(staffId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.staffId === staffId
    );
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const targetDate = new Date(date);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return Array.from(this.appointments.values()).filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const appointmentDateString = appointmentDate.toISOString().split('T')[0];
      return appointmentDateString === targetDateString;
    });
  }

  async getTodayAppointments(): Promise<PatientWithAppointment[]> {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const appointments = await this.getAppointmentsByDate(todayString);
    
    const patientsWithAppointments: PatientWithAppointment[] = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await this.getPatient(appointment.patientId);
        const doctor = await this.getStaff(appointment.staffId);
        
        // If patient or doctor is not found, skip this appointment instead of throwing error
        if (!patient || !doctor) {
          console.warn(`Warning: Appointment with ID ${appointment.id} has invalid patient or doctor reference`);
          // Return a minimal placeholder to maintain the array structure
          return {
            id: -1, // Invalid ID to indicate error
            medicalRecordNumber: 'ERROR',
            firstName: 'Missing',
            lastName: 'Data',
            dateOfBirth: new Date(),
            gender: '',
            phoneNumber: '',
            email: '',
            address: '',
            emergencyContact: '',
            emergencyPhone: '',
            bloodType: '',
            registrationDate: new Date(),
            appointmentTime: '',
            appointmentDate: '',
            doctorName: '',
            specialization: '',
            status: 'Error',
          };
        }
        
        return {
          ...patient,
          appointmentTime: appointment.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          appointmentDate: new Date(appointment.date).toLocaleDateString(),
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          specialization: doctor.specialization || "",
          status: appointment.status,
        };
      })
    );
    
    // Filter out any error placeholders
    return patientsWithAppointments.filter(app => app.id !== -1);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      return undefined;
    }
    
    const updatedAppointment: Appointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Medical Record operations
  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.patientId === patientId
    );
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.medicalRecordId++;
    const newRecord: MedicalRecord = { ...record, id };
    this.medicalRecords.set(id, newRecord);
    return newRecord;
  }

  async updateMedicalRecord(id: number, recordData: Partial<MedicalRecord>): Promise<MedicalRecord | undefined> {
    const record = await this.getMedicalRecord(id);
    if (!record) {
      return undefined;
    }
    
    const updatedRecord: MedicalRecord = { ...record, ...recordData };
    this.medicalRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteMedicalRecord(id: number): Promise<boolean> {
    return this.medicalRecords.delete(id);
  }

  // Hospital statistics operations
  async getHospitalStats(date: string): Promise<HospitalStat | undefined> {
    return this.hospitalStats.get(date);
  }

  async getLatestHospitalStats(): Promise<HospitalStat | undefined> {
    const stats = Array.from(this.hospitalStats.values());
    if (stats.length === 0) {
      return undefined;
    }
    
    return stats.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    })[0];
  }

  async updateHospitalStats(date: string, statsData: Partial<HospitalStat>): Promise<HospitalStat | undefined> {
    const stats = await this.getHospitalStats(date);
    if (!stats) {
      return undefined;
    }
    
    const updatedStats: HospitalStat = { ...stats, ...statsData };
    this.hospitalStats.set(date, updatedStats);
    return updatedStats;
  }

  async createHospitalStats(statsData: InsertHospitalStat): Promise<HospitalStat> {
    const id = this.hospitalStatId++;
    const dateStr = new Date(statsData.date).toISOString().split('T')[0];
    const newStats: HospitalStat = { ...statsData, id };
    this.hospitalStats.set(dateStr, newStats);
    return newStats;
  }
}

export const storage = new MemStorage();
