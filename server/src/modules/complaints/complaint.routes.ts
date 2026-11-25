import { Router } from "express";
import {
  createComplaint,
  listComplaints,
  supervisorSummary,
  updateComplaintStatus,
  forwardComplaint,
} from "./complaint.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listComplaints);
router.post("/", createComplaint);

// Supervisor Summary for Supervisor, Warden, Admin, Student Representative, Student
router.get(
  ["/supervisor-summary", "/ai/supervisor-summary"],
  requireRole("STUDENT", "SUPERVISOR", "WARDEN", "ADMIN", "STUDENT_COORDINATOR"),
  supervisorSummary,
);

// Update status: Warden, Supervisor, Student Representative, Admin
router.patch(
  "/:id/status",
  requireRole("SUPERVISOR", "WARDEN", "ADMIN", "STUDENT_COORDINATOR"),
  updateComplaintStatus,
);

// Review & Forward complaints: Student Representative, Supervisor, Warden, Admin
router.post(
  "/:id/forward",
  requireRole("STUDENT_COORDINATOR", "SUPERVISOR", "WARDEN", "ADMIN"),
  forwardComplaint,
);

export default router;
