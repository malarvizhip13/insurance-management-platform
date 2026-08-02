import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import Documents from "./pages/Documents";
import PremiumPayments from "./pages/PremiumPayments";
import Employees from "./pages/Employees";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Pages */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <Layout>
              <Customers />
            </Layout>
          }
        />

        {/* Policies */}
        <Route
          path="/policies"
          element={
            <Layout>
              <Policies />
            </Layout>
          }
        />

        {/* Claims */}
        <Route
          path="/claims"
          element={
            <Layout>
              <Claims />
            </Layout>
          }
        />

        {/* Documents */}
        <Route
          path="/documents"
          element={
            <Layout>
              <Documents />
            </Layout>
          }
        />

        {/* Payments */}
        <Route
          path="/payments"
          element={
            <Layout>
              <PremiumPayments />
            </Layout>
          }
        />

        {/* Employees */}
        <Route
          path="/employees"
          element={
            <Layout>
              <Employees />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;