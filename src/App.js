import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Staff from "scenes/employees";
import Geography from "scenes/geography";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
import { LanguageContext } from "language";
import Cookies from "universal-cookie";
import Login from "scenes/auth/Login";
import Users from "scenes/users";
import Services from "scenes/services";
import AddEmployee from "scenes/employees/Addemployee";
import Attendance from "scenes/attendance";
import ResetStaff from "scenes/attendance/ResetStaff";
import ResetAllStaff from "scenes/attendance/ResetAllStaff";
import Orders from "scenes/orders";
import AddOrder from "scenes/orders/AddOrder";
import Order from "scenes/orders/Order";
import Bills from "scenes/bills";
import Inventory from "scenes/inventory";
import Clients from "scenes/clients";
import AddUser from "scenes/users/AddUsers";
import AddClient from "scenes/clients/AddClient";
import AddService from "scenes/services/AddService";
import Reports from "./scenes/reports/index";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  return (
    <div className="app" dir={context.language === "en" ? "ltr" : "rtl"}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {cookies.get("_auth_token") ? (
            cookies.get("_auth_role") === "Admin" ? (
              <Routes>
                <Route element={<Layout />}>
                  <Route
                    path="/*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/employees" element={<Staff />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/addemployee" element={<AddEmployee />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/resetstaff" element={<ResetStaff />} />
                  <Route path="/resetallstaff" element={<ResetAllStaff />} />
                  <Route path="/addorder" element={<AddOrder />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/adduser" element={<AddUser />} />
                  <Route path="/addclient" element={<AddClient />} />
                  <Route path="/addservice" element={<AddService />} />
                  <Route path="/reports" element={<Reports />} />
                </Route>
              </Routes>
            ) : (
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/addorder" element={<AddOrder />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route
                    path="/*"
                    element={<Navigate to="/clients" replace />}
                  />
                </Route>
              </Routes>
            )
          ) : (
            <Routes>
              <Route path="/*" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;
