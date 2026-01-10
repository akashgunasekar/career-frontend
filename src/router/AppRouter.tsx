import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStats from "../pages/admin/AdminStats";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminQuestions from "../pages/admin/AdminQuestions";
import AdminCounsellors from "../pages/admin/AdminCounsellors";
import AdminCareers from "../pages/admin/AdminCareers";
import AdminColleges from "../pages/admin/AdminColleges";

import StudentLogin from "../pages/student/StudentLogin";
import StudentVerifyOTP from "../pages/student/StudentVerifyOTP";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";

import InstituteLogin from "../pages/institute/InstituteLogin";
import InstituteVerifyOTP from "../pages/institute/InstituteVerifyOTP";
import InstituteDashboard from "../pages/institute/InstituteDashboard";

import ProtectedRoute from "./ProtectedRoute";

/** ----- NEW IMPORTS ----- */
import AssessmentStart from "../pages/student/assessment/AssessmentStart";
import AssessmentStepper from "../pages/student/assessment/AssessmentStepper";
import AssessmentCompleted from "../pages/student/assessment/AssessmentCompleted";
import AssessmentResults from "../pages/student/assessment/AssessmentResults";
import CareerColleges from "../pages/career/CareerColleges";
import CareerLibrary from "../pages/career/CareerLibrary";
import CareerDetail from "../pages/career/CareerDetail";
import CollegeList from "../pages/college/CollegeList";
import CollegeDetail from "../pages/college/CollegeDetail";
import CounsellorList from "../pages/counsellor/CounsellorList";
import CounsellorProfile from "../pages/counsellor/CounsellorProfile";
import CounsellorDashboard from "../pages/counsellor/CounsellorDashboard";
import PremiumUpgrade from "../pages/student/PremiumUpgrade";
import Notifications from "../pages/student/Notifications";
import Onboarding from "../pages/onboarding/Onboarding";
import LandingPage from "../pages/onboarding/LandingPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- LANDING -------- */}
        <Route path="/" element={<Onboarding />} />
          {/* <Route path="/" element={<LandingPage/>} /> */}

        {/* -------- ADMIN ROUTES -------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/counsellors" element={<AdminCounsellors />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/colleges" element={<AdminColleges />} />
        </Route>

        {/* -------- STUDENT ROUTES -------- */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/verify-otp" element={<StudentVerifyOTP />} />

        <Route element={<ProtectedRoute role="student" />}>
          {/* Profile & Dashboard */}
          <Route path="/student/complete-profile" element={<StudentProfile />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/notifications" element={<Notifications />} />
          <Route path="/student/premium" element={<PremiumUpgrade />} />

          {/* Assessment Flow */}
          <Route path="/student/assessment/start" element={<AssessmentStart />} />
          <Route path="/student/assessment/test" element={<AssessmentStepper />} />
          <Route path="/student/assessment/result" element={<AssessmentCompleted />} />
          <Route path="/student/assessment/results" element={<AssessmentResults />} />

          {/* Career Pages */}
          <Route path="/student/career-library" element={<CareerLibrary />} />
          <Route path="/student/career/:careerId" element={<CareerDetail />} />
          <Route path="/student/career/:careerId/colleges" element={<CareerColleges />} />

          {/* College Pages */}
          <Route path="/student/colleges" element={<CollegeList />} />
          <Route path="/student/college/:collegeId" element={<CollegeDetail />} />

          {/* Counselor Booking */}
          <Route path="/student/counsellors" element={<CounsellorList />} />
          <Route path="/student/counsellor/:counsellorId" element={<CounsellorProfile />} />
        </Route>

        {/* -------- INSTITUTE ROUTES -------- */}
        <Route path="/institute/login" element={<InstituteLogin />} />
        <Route path="/institute/verify-otp" element={<InstituteVerifyOTP />} />

        <Route element={<ProtectedRoute role="institute" />}>
          <Route path="/institute/dashboard" element={<InstituteDashboard />} />
        </Route>

        {/* -------- COUNSELLOR ROUTES -------- */}
        <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />

        {/* -------- DEFAULT CATCH ROUTE -------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
