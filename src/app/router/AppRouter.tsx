import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

function LoginPage() {
  return <div>Login</div>;
}

function RegisterPage() {
  return <div>Register</div>;
}

function DashboardPage() {
  return <div>Dashboard</div>;
}

function CompaniesPage() {
  return <div>Companies</div>;
}

function VacanciesPage() {
  return <div>Vacancies</div>;
}

function InterviewsPage() {
  return <div>Interviews</div>;
}

function ResumesPage() {
  return <div>Resumes</div>;
}

function NotFoundPage() {
  return <div>404 — Page not found</div>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
