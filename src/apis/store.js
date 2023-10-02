import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global/index";
//Auth
import LoginReducer from "./auth/Login";
//Attendance
import GetAttendanceReducer from "./data/Attendance/GetAttendance";
//Data
import GetStaffReducer from "./data/Staff/GetStaff";
import GetUsersReducer from "./data/Users/GetUsers";
import DeleteUserReducer from "./data/Users/DeleteUser";
import GetClientsReducer from "./data/Clients/GetClients";
import SearchClientReducer from "./data/Clients/SearchClients";
import EditClientReducer from "./data/Clients/EditClient"
import AddUsersReducer from "./data/Users/AddUsers";
import EditUsersReducer from "./data/Users/EditUser";
import DeleteClientReducer from "./data/Clients/DeleteClient";
import AddClientReducer from "./data/Clients/AddClient";
//Dashboard
import GetAllDataReducer from "./dashboard/DashboardData";
//Staff
import AddAttendanceReducer from "./data/Staff/AddAttendance"
import AddStaffReducer from "./data/Staff/AddStaff";
import DeleteStaffReducer from "./data/Staff/DeleteStaff";
import ResetAttendanceReducer from "./data/Staff/ResetAttendance";
import ResetAllAttendanceReducer from "./data/Staff/ResetAllAttendance";
import GetOrdersForStaffReducer from "./data/Staff/GetOrderForStaff";
//Services
import GetServicesReducer from "./Services/GetServices";
import AddServicesReducer from "./Services/AddServices";
import DeleteServicesReducer from "./Services/GetServices";
//Orders
import GetAllOrdersReducer from "./Orders/GetOrders";
import DeleteOrderReducer from "./Orders/DeleteOrders";
import AddOrderReducer from "./Orders/AddOrders";
//Inventory
import GetInventoryReducer from "./Inventory/GetInventory";
import DeleteItemReducer from "./Inventory/DeleteItem";
import EditItemReducer from "./Inventory/EditItem";
import AddItemReducer from "./Inventory/AddItem";
//Bills
import GetBillsReducer from "./Bills/GetBills";
import AddBillsReducer from "./Bills/AddBill";
import EditBillsReducer from "./Bills/EditBill"
import PayBillsReducer from "./Bills/PayBills";
//Reports
import GetReportsReducer from "./Reports/GetReports";
export default configureStore({
  reducer: {
    global: globalReducer,
    //Auth
    Login: LoginReducer,
    //Attndance
    GetAttendance: GetAttendanceReducer,
    //Data
    GetStaff: GetStaffReducer,
    GetClients: GetClientsReducer,
    SearchClient: SearchClientReducer,
    EditClient: EditClientReducer,
    DeleteClient: DeleteClientReducer,
    AddClient: AddClientReducer,
    //Dashboard
    GetAllData: GetAllDataReducer,
    //Users
    AddUsers: AddUsersReducer,
    GetUsers: GetUsersReducer,
    DeleteUser: DeleteUserReducer,
    EditUser: EditUsersReducer,
    //Staff
    AddStaff: AddStaffReducer,
    GetOrdersForStaff: GetOrdersForStaffReducer,
    AddAttendance: AddAttendanceReducer,
    DeleteStaff: DeleteStaffReducer,
    ResetAttendance: ResetAttendanceReducer,
    ResetAllAttendance: ResetAllAttendanceReducer,
    //Services
    GetServices: GetServicesReducer,
    DeleteServices: DeleteServicesReducer,
    AddServices: AddServicesReducer,
    //Orders
    GetAllOrders: GetAllOrdersReducer,
    DeleteOrder: DeleteOrderReducer,
    AddOrder: AddOrderReducer,
    //Inventory
    GetInventory: GetInventoryReducer,
    DeleteItem: DeleteItemReducer,
    EditItem: EditItemReducer,
    AddItem: AddItemReducer,
    //Bills
    GetBills: GetBillsReducer,
    AddBills: AddBillsReducer,
    EditBills: EditBillsReducer,
    PayBills: PayBillsReducer,
    //Reports
    GetReports: GetReportsReducer,
  },
});
