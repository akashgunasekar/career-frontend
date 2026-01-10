// src/api/studentApi.ts
import axiosClient from "./axiosClient";

export interface StudentUser {
  id: number;
  phone: string;
  full_name?: string;
  is_profile_complete: boolean;
}

export async function sendOtp(phone: string) {
  const res = await axiosClient.post("/student/auth/send-otp", { phone });
  return res.data;
}

export async function verifyOtp(phone: string, otp: string) {
  const res = await axiosClient.post("/student/auth/verify-otp", { phone, otp });
  return res.data as { token: string; user: StudentUser };
}

export async function completeProfile(profile: {
  studentId: number;
  full_name: string;
  grade?: string;
  board?: string;
  city?: string;
}) {
  const res = await axiosClient.post("/student/profile", profile);
  return res.data;
}

// Tests
export async function startTest(studentId: number, testCode: string) {
  const res = await axiosClient.post("/tests/start", { studentId, testCode });
  return res.data;
}

export async function submitTest(sessionId: number, answers: {
  questionId: number;
  optionId: number;
  score: number;
}[]) {
  const res = await axiosClient.post("/tests/submit", { sessionId, answers });
  return res.data;
}

export async function getResults(studentId: number) {
  const res = await axiosClient.get(`/tests/result/${studentId}`);
  return res.data;
}

// Careers & colleges
export async function getRecommendedCareers(studentId: number) {
  const res = await axiosClient.get(`/career/recommended/${studentId}`);
  return res.data;
}

export async function getCollegesForCareer(careerId: number) {
  const res = await axiosClient.get(`/career/colleges/${careerId}`);
  return res.data;
}

// Counselor booking
export async function getSlots() {
  const res = await axiosClient.get("/booking/slots");
  return res.data;
}

export async function bookSlot(studentId: number, slotId: number) {
  const res = await axiosClient.post("/booking/book", { studentId, slotId });
  return res.data;
}

export async function getMyBookings(studentId: number) {
  const res = await axiosClient.get(`/booking/my-bookings/${studentId}`);
  return res.data;
}


// student test

export const startTestSession = async (studentId: number) => {
  const { data } = await axiosClient.post("/tests/start", { studentId });
  return data;
};

export const getNextQuestion = async (sessionId: number) => {
  const { data } = await axiosClient.get(`/tests/next/${sessionId}`);
  return data;
};

export const submitAnswer = async (payload: { sessionId: number; questionId: number; optionId: number }) => {
  return axiosClient.post(`/tests/answer`, payload);
};

export const moveToNextStage = async (sessionId: number) => {
  const { data } = await axiosClient.post(`/tests/next-stage`, { sessionId });
  return data;
};

export const getFinalResults = async (studentId: number) => {
  const { data } = await axiosClient.get(`/tests/result/${studentId}`);
  return data;
};