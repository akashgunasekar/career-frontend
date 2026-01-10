// src/api/adminApi.ts
import axiosClient from "./axiosClient";

// ============ AUTH ============
export async function adminLogin(username: string, password: string) {
  const res = await axiosClient.post("/admin/login", { username, password });
  return res.data;
}

// ============ STATS ============
export async function getOverviewStats() {
  const res = await axiosClient.get("/admin/stats/overview");
  return res.data;
}

export async function getStudentDetails(studentId: number) {
  const res = await axiosClient.get(`/admin/stats/student-results/${studentId}`);
  return res.data;
}

// ============ STUDENTS ============
export async function getStudents(params?: { search?: string; page?: number; limit?: number }) {
  const res = await axiosClient.get("/admin/students", { params });
  return res.data;
}

export async function getStudentById(id: number) {
  const res = await axiosClient.get(`/admin/students/${id}`);
  return res.data;
}

export async function createStudent(data: {
  phone: string;
  full_name?: string;
  grade?: string;
  board?: string;
  city?: string;
}) {
  const res = await axiosClient.post("/admin/students", data);
  return res.data;
}

export async function updateStudent(id: number, data: {
  phone?: string;
  full_name?: string;
  grade?: string;
  board?: string;
  city?: string;
  is_profile_complete?: boolean;
}) {
  const res = await axiosClient.put(`/admin/students/${id}`, data);
  return res.data;
}

export async function deleteStudent(id: number) {
  const res = await axiosClient.delete(`/admin/students/${id}`);
  return res.data;
}

// ============ CAREERS ============
export async function getCareers(params?: { search?: string; category?: string; page?: number; limit?: number }) {
  const res = await axiosClient.get("/admin/careers", { params });
  return res.data;
}

export async function getCareerById(id: number) {
  const res = await axiosClient.get(`/admin/careers/${id}`);
  return res.data;
}

export async function createCareer(data: {
  name: string;
  description?: string;
  category?: string;
  average_salary?: string;
  growth_rate?: string;
  education_required?: string;
  skills_required?: string;
  is_active?: boolean;
}) {
  const res = await axiosClient.post("/admin/careers", data);
  return res.data;
}

export async function updateCareer(id: number, data: {
  name?: string;
  description?: string;
  category?: string;
  average_salary?: string;
  growth_rate?: string;
  education_required?: string;
  skills_required?: string;
  is_active?: boolean;
}) {
  const res = await axiosClient.put(`/admin/careers/${id}`, data);
  return res.data;
}

export async function deleteCareer(id: number) {
  const res = await axiosClient.delete(`/admin/careers/${id}`);
  return res.data;
}

// ============ COLLEGES ============
export async function getColleges(params?: { search?: string; location?: string; page?: number; limit?: number }) {
  const res = await axiosClient.get("/admin/colleges", { params });
  return res.data;
}

export async function getCollegeById(id: number) {
  const res = await axiosClient.get(`/admin/colleges/${id}`);
  return res.data;
}

export async function createCollege(data: {
  name: string;
  location?: string;
  description?: string;
  rating?: number;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  established_year?: number;
  is_active?: boolean;
}) {
  const res = await axiosClient.post("/admin/colleges", data);
  return res.data;
}

export async function updateCollege(id: number, data: {
  name?: string;
  location?: string;
  description?: string;
  rating?: number;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  established_year?: number;
  is_active?: boolean;
}) {
  const res = await axiosClient.put(`/admin/colleges/${id}`, data);
  return res.data;
}

export async function deleteCollege(id: number) {
  const res = await axiosClient.delete(`/admin/colleges/${id}`);
  return res.data;
}

// ============ COUNSELORS ============
export async function getCounselors(params?: { search?: string; specialization?: string; page?: number; limit?: number }) {
  const res = await axiosClient.get("/admin/counselors", { params });
  return res.data;
}

export async function getCounselorById(id: number) {
  const res = await axiosClient.get(`/admin/counselors/${id}`);
  return res.data;
}

export async function createCounselor(data: {
  name: string;
  specialization: string;
  experience_years?: number;
  qualification?: string;
  bio?: string;
  email?: string;
  phone?: string;
  fee_per_session?: number;
  is_active?: boolean;
}) {
  const res = await axiosClient.post("/admin/counselors", data);
  return res.data;
}

export async function updateCounselor(id: number, data: {
  name?: string;
  specialization?: string;
  experience_years?: number;
  qualification?: string;
  bio?: string;
  email?: string;
  phone?: string;
  fee_per_session?: number;
  is_active?: boolean;
}) {
  const res = await axiosClient.put(`/admin/counselors/${id}`, data);
  return res.data;
}

export async function deleteCounselor(id: number) {
  const res = await axiosClient.delete(`/admin/counselors/${id}`);
  return res.data;
}

// ============ QUESTIONS ============
export async function getQuestions(params?: { test_id?: number; test_code?: string; page?: number; limit?: number }) {
  const res = await axiosClient.get("/admin/questions", { params });
  return res.data;
}

export async function getQuestionById(id: number) {
  const res = await axiosClient.get(`/admin/questions/${id}`);
  return res.data;
}

export async function createQuestion(data: {
  test_id: number;
  question_text: string;
  sequence?: number;
  options?: Array<{ text: string; score: number; category?: string }>;
}) {
  const res = await axiosClient.post("/admin/questions", data);
  return res.data;
}

export async function updateQuestion(id: number, data: {
  question_text?: string;
  sequence?: number;
  test_id?: number;
  options?: Array<{ text: string; score: number; category?: string }>;
}) {
  const res = await axiosClient.put(`/admin/questions/${id}`, data);
  return res.data;
}

export async function deleteQuestion(id: number) {
  const res = await axiosClient.delete(`/admin/questions/${id}`);
  return res.data;
}

// ============ NOTIFICATIONS ============
export async function getNotifications(studentId?: number) {
  const res = await axiosClient.get(studentId ? `/notifications/student/${studentId}` : "/notifications");
  return res.data;
}

export async function markNotificationRead(id: number) {
  const res = await axiosClient.put(`/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsRead(studentId: number) {
  const res = await axiosClient.put(`/notifications/student/${studentId}/read-all`);
  return res.data;
}

export async function createNotification(data: {
  student_id: number;
  title: string;
  message: string;
  type?: string;
}) {
  const res = await axiosClient.post("/notifications", data);
  return res.data;
}
