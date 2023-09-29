import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LanguageContext } from "language";
import {
  PersonOutlineOutlined,
  LocalHospitalOutlined,
  PhoneEnabledOutlined,
  Delete,
  FlagOutlined,
  Edit,
  AddOutlined,
  SupportAgentOutlined,
  RestartAltOutlined,
} from "@mui/icons-material";
import { DeleteStaffHandler } from "apis/data/Staff/DeleteStaff";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ResetAttendanceHandler } from "apis/data/Staff/ResetAttendance";
import { AddAttendanceHandler } from "apis/data/Staff/AddAttendance";
import { Formik } from "formik";
import { ResetAllAttendanceHandler } from "apis/data/Staff/ResetAllAttendance";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { GetAttendanceHandler } from "apis/data/Attendance/GetAttendance";

const Attendance = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const navigator = useNavigate();
  const [date, setDate] = useState(dayjs(new Date()));
  const [type, setType] = useState("daily");
  const state = useSelector((state) => state.GetAttendance);
  
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "لاسم",
      flex: 0.5,
      valueGetter: (value) => value.row.staff.name,
    },
    {
      field: "type",
      headerName: context.language === "en" ? "Type" : "النوع",
      flex: 1,
      renderCell: (value) => {
        const type = value.row.staff.type;
        return (
          <Box
            width="60%"
            p="5px"
            display="flex"
            backgroundColor={
              type === "DOCTOR"
                ? theme.palette.mode === "dark"
                  ? theme.palette.primary[800]
                  : theme.palette.primary[200]
                : type === "CALL_CENTER"
                ? theme.palette.primary[600]
                : type === "ASSISTANT"
                ? theme.palette.primary[400]
                : type === "RECIPTIONST"
                ? theme.palette.primary[300]
                : theme.palette.secondary[600]
            }
            borderRadius="4px"
          >
            {type === "CALL_CENTER" ? (
              <PhoneEnabledOutlined />
            ) : type === "DOCTOR" ? (
              <LocalHospitalOutlined />
            ) : type === "ASSISTANT" ? (
              <FlagOutlined />
            ) : type === "RECIPTIONST" ? (
              <SupportAgentOutlined />
            ) : (
              <PersonOutlineOutlined />
            )}
            <Typography color={theme.palette.grey[100]} sx={{ ml: "5px" }}>
              {type === "DOCTOR"
                ? context.language === "en"
                  ? "Doctor"
                  : "دكتور"
                : type === "CALL_CENTER"
                ? context.language === "en"
                  ? "Call Center"
                  : "خدمة عملاء"
                : type === "ASSISTANT"
                ? context.language === "en"
                  ? "Assistant"
                  : "مساعد"
                : type === "RECIPTIONST"
                ? context.language === "en"
                  ? "Receptionist"
                  : "مستقبل"
                : context.language === "en"
                ? "Other"
                : "أخرى"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "salary",
      headerName:
        context.language === "en" ? "Salary / Percentage" : "النسبه / المرتب",
      flex: 1,
      valueGetter: ({ row }) => {
        if (row.staff.salary) {
          return row.staff.salary;
        } else if (row.staff.percentage) {
          return row.staff.percentage * 100 + "%";
        } else {
          return "____________";
        }
      },
    },
    {
      field: "counter",
      headerName: context.language === "en" ? "Attendance" : "الحضور",
      flex: 0.5,
    },
  ];
  const day = date.$D;
  const year = date.$y;
  const month = date.$M + 1;

  const getAttendace = () => {
    dispatch(GetAttendanceHandler({ type, day, month, year })).then((res) => {
      if (res.payload.status === 200) {
        setRows(res.payload.data.attendances);
      }
    });
  };

  useEffect(() => {
    dispatch(GetAttendanceHandler({ type, day, year, month })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.attendances);
        }
      }
    });
  }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexDirection={{xs: 'column', md: 'row'}}
        alignItems={"center"}
      >
        <Header
          title={context.language === "en" ? "ATTENDANCE" : "الحضور"}
          subtitle={
            context.language === "en" ? "List Of Attendance" : "قائمه الحضور"
          }
        />
        <Box display={"flex"} gap={2}>
          <Button
            sx={{
              display:
                cookies.get("_auth_role") === "Admin" ? "inlineblock" : "none",
              backgroundColor: theme.palette.primary[500],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/resetallstaff")}
          >
            {context.language === "en" ? "Reset a field" : "اعاده حضور تخصص"}
            <RestartAltOutlined sx={{ mr: "10px" }} />
          </Button>
          <Button
            sx={{
              display:
                cookies.get("_auth_role") === "Admin" ? "inlineblock" : "none",
              backgroundColor: theme.palette.primary[500],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/resetstaff")}
          >
            {context.language === "en"
              ? "Reset an employee"
              : " اعاده حضور موظف"}
            <RestartAltOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box height="75vh">
        <Box display={"flex"} justifyContent={"center"} gap={2} p={2}>
          <Select
            value={type}
            defaultValue={"daily"}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value={"yearly"}>
              {context.language === "en" ? "Yearly" : "سنوي"}
            </MenuItem>
            <MenuItem value={"monthly"}>
              {context.language === "en" ? "Monthly" : "شهري"}
            </MenuItem>
            <MenuItem value={"daily"}>
              {context.language === "en" ? "Daily" : "يومي"}
            </MenuItem>
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs(new Date())}
              value={date}
              onChange={(value) => {
                setDate(value);
              }}
            />
          </LocalizationProvider>
          <Button
            onClick={() => (date ? getAttendace() : "")}
            variant="contained"
          >
            {context.language === "en" ? "Submit" : "أستمرار"}
          </Button>
        </Box>
        {state.loading ? (
          <Box
            display={"flex"}
            height={"100%"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : rows.length ? (
          <DataGrid
            autoPageSize
            disableSelectionOnClick
            checkboxSelection
            loading={false}
            localeText={context.language === "en" ? null : arabicLocaleText}
            components={{ Toolbar: GridToolbar }}
            rows={rows.map((user, index) => ({
              id: index + 1,
              ...user,
            }))}
            // sx={{
            //   "& .MuiDataGrid-virtualScroller": {
            //     backgroundColor: theme.palette.primary[500],
            //   },
            // }}
            columns={columns}
          />
        ) : (
          <Box
            display={"flex"}
            height={"100%"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {state.data.attendances && state.data.attendances.length === 0
              ? context.language === "en"
                ? "No date found."
                : "لا توجد بيانات"
              : ""}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const arabicLocaleText = {
  toolbarDensity: "كثافة",
  toolbarDensityLabel: "كثافة",
  toolbarDensityCompact: "مضغوط",
  toolbarDensityStandard: "معياري",
  toolbarDensityComfortable: "مريح",
  toolbarColumns: "أعمدة",
  toolbarFilters: "تصفية",
  filterOperatorAnd: "Custom And",
  filterOperatorOr: "Custom Or",
  filterValuePlaceholder: "Custom Value",
  toolbarFiltersTooltipHide: "إخفاء الفلاتر",
  toolbarFiltersTooltipShow: "عرض الفلاتر",
  noResultsOverlayLabel: "لا توجد نتائج",
  noRowsLabel: "لا تجود كروت اتصالات",
  toolbarFiltersTooltipActive: (count) =>
    `${count} ${count === 1 ? "فلتر" : "فلاتر"}`,
  toolbarExport: "تصدير",
  toolbarExportPrint: "طباعه",
  toolbarExportCSV: "CSV تنزيل",
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} صفوف محددة`
      : `${count.toLocaleString()} صف محدد`,
};

export default Attendance;
