import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import Documents from "./pages/Documents";
import PremiumPayments from "./pages/PremiumPayments";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/payments" element={<PremiumPayments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;