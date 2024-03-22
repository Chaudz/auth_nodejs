import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../Homepage";
import { LoginForm, RegistrationForm } from "../components";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
