import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LanguageContext } from "language";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { GetReportsHandler } from "apis/Reports/GetReports";

const Reports = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const navigator = useNavigate();
  const [date, setDate] = useState(dayjs(new Date()));
  const [type, setType] = useState("daily");
  const state = useSelector((state) => state.GetReports);
  const [data, setData] = useState({});
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "service",
      headerName: context.language === "en" ? "Service" : "الخدمه",
      valueGetter: (value) => value.row.service,
      flex: 1,
    },
    {
      field: "amount_paid",
      headerName: context.language === "en" ? "Amount Paid" : "المبلغ المدفوع",
      valueGetter: (value) => value.row.amount_paid,
      flex: 0.5,
    },
    {
      field: "doctor_percentage",
      headerName:
        context.language === "en" ? "Doctor Percentage" : "نسبة الطبيب",
      valueGetter: (value) => value.row.doctor_percentage,
      flex: 1,
    },
    {
      field: "call_center_percentage",
      headerName:
        context.language === "en" ? "Call Center Percentage" : "نسبة مركز الاتصال",
      valueGetter: (value) => value.row.call_center_percentage,
      flex: 1,
    },
    {
      field: "profit",
      headerName: context.language === "en" ? "Profit" : "الربح",
      valueGetter: (value) => value.row.profit,
    },
  ];
  const day = date.$D;
  const year = date.$y;
  const month = date.$M + 1;

  const getAttendace = () => {
    dispatch(GetReportsHandler({ type, day, month, year })).then((res) => {
      if (res.payload.status === 200) {
        setRows(res.payload.data.reports.orders);
        setData({
          totalIncome: res.payload.data.reports.totalInComes,
          totalSalaries: res.payload.data.reports.getTotalSalaries,
          totalProfite: res.payload.data.reports.totalProfit,
        });
      }
    });
  };

  useEffect(() => {
    dispatch(GetReportsHandler({ type, day, year, month })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.reports.orders);
          setData({
            totalIncome: res.payload.data.reports.totalInComes,
            totalSalaries: res.payload.data.reports.getTotalSalaries,
            totalProfite: res.payload.data.reports.totalProfit,
          });
        }
      }
    });
  }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title={context.language === "en" ? "REPORTS" : "التقارير"}
          subtitle={
            context.language === "en" ? "List Of Reports" : "قائمه التقارير"
          }
        />
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
        {data && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            gap={5}
          >
            <Typography>
              {context.language === "en"
                ? `Total Income: ${data.totalIncome}`
                : `الدخل الكلي : ${data.totalIncome}`}
            </Typography>
            <Typography>
              {context.language === "en"
                ? `Total Salary: ${data.totalSalaries}`
                : `كامل الرواتب: ${data.totalSalaries || 0}`}
            </Typography>
            <Typography>
              {context.language === "en"
                ? `Total Profite: ${data.totalProfite}`
                : `اجمالي الربح: ${data.totalProfite}`}
            </Typography>
          </Box>
        )}
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
  noRowsLabel: "لا توجد بيانات",
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

export default Reports;
