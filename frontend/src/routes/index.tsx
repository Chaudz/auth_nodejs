import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../Homepage";
import FormLogin from "../components/LoginForm/LoginForm";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<FormLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
