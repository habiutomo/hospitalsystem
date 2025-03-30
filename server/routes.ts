import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix - commented out as we're defining routes directly
  // No router needed as we're defining specific routes
  
  // Patients routes
  app.get("/api/patients", async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      let patients;
      
      if (query) {
        patients = await storage.searchPatients(query);
      } else {
        patients = await storage.getAllPatients();
      }
      
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patients" });
    }
  });

  app.get("/api/patients/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const patients = await storage.getRecentPatients(limit);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patient = req.body;
      const newPatient = await storage.createPatient(patient);
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ message: "Error creating patient" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patientData = req.body;
      
      const updatedPatient = await storage.updatePatient(id, patientData);
      
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(updatedPatient);
    } catch (error) {
      res.status(500).json({ message: "Error updating patient" });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePatient(id);
      
      if (!success) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting patient" });
    }
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff" });
    }
  });

  app.get("/api/staff/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching doctors" });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staff = await storage.getStaff(id);
      
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const staff = req.body;
      const newStaff = await storage.createStaff(staff);
      res.status(201).json(newStaff);
    } catch (error) {
      res.status(500).json({ message: "Error creating staff" });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffData = req.body;
      
      const updatedStaff = await storage.updateStaff(id, staffData);
      
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      
      res.json(updatedStaff);
    } catch (error) {
      res.status(500).json({ message: "Error updating staff" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStaff(id);
      
      if (!success) {
        return res.status(404).json({ message: "Staff not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting staff" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const date = req.query.date as string;
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      const staffId = req.query.staffId ? parseInt(req.query.staffId as string) : undefined;
      
      let appointments;
      
      if (date) {
        appointments = await storage.getAppointmentsByDate(date);
      } else if (patientId) {
        appointments = await storage.getAppointmentsByPatient(patientId);
      } else if (staffId) {
        appointments = await storage.getAppointmentsByStaff(staffId);
      } else {
        appointments = await storage.getAllAppointments();
      }
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });

  app.get("/api/appointments/today", async (req, res) => {
    try {
      const appointments = await storage.getTodayAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      res.status(500).json({ message: "Error fetching today's appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = req.body;
      const newAppointment = await storage.createAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = req.body;
      
      const updatedAppointment = await storage.updateAppointment(id, appointmentData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Error updating appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppointment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting appointment" });
    }
  });

  // Medical Record routes
  app.get("/api/medical-records", async (req, res) => {
    try {
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      
      let records;
      
      if (patientId) {
        records = await storage.getMedicalRecordsByPatient(patientId);
      } else {
        return res.status(400).json({ message: "Patient ID is required" });
      }
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Error fetching medical records" });
    }
  });

  app.get("/api/medical-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const record = await storage.getMedicalRecord(id);
      
      if (!record) {
        return res.status(404).json({ message: "Medical record not found" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Error fetching medical record" });
    }
  });

  app.post("/api/medical-records", async (req, res) => {
    try {
      const record = req.body;
      const newRecord = await storage.createMedicalRecord(record);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ message: "Error creating medical record" });
    }
  });

  app.put("/api/medical-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recordData = req.body;
      
      const updatedRecord = await storage.updateMedicalRecord(id, recordData);
      
      if (!updatedRecord) {
        return res.status(404).json({ message: "Medical record not found" });
      }
      
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: "Error updating medical record" });
    }
  });

  app.delete("/api/medical-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMedicalRecord(id);
      
      if (!success) {
        return res.status(404).json({ message: "Medical record not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting medical record" });
    }
  });

  // Hospital Statistics routes
  app.get("/api/hospital-stats", async (req, res) => {
    try {
      const date = req.query.date as string;
      
      let stats;
      
      if (date) {
        stats = await storage.getHospitalStats(date);
      } else {
        stats = await storage.getLatestHospitalStats();
      }
      
      if (!stats) {
        return res.status(404).json({ message: "Hospital statistics not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hospital statistics" });
    }
  });

  app.post("/api/hospital-stats", async (req, res) => {
    try {
      const stats = req.body;
      const newStats = await storage.createHospitalStats(stats);
      res.status(201).json(newStats);
    } catch (error) {
      res.status(500).json({ message: "Error creating hospital statistics" });
    }
  });

  app.put("/api/hospital-stats", async (req, res) => {
    try {
      const date = req.query.date as string;
      const statsData = req.body;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
      
      const updatedStats = await storage.updateHospitalStats(date, statsData);
      
      if (!updatedStats) {
        return res.status(404).json({ message: "Hospital statistics not found" });
      }
      
      res.json(updatedStats);
    } catch (error) {
      res.status(500).json({ message: "Error updating hospital statistics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
