import React, { useContext, useEffect, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  MovingOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import StatBox from "components/StatBox";
import { LanguageContext } from "language";
import BarChart from "components/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { GetAllDataHandler } from "apis/dashboard/DashboardData";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const context = useContext(LanguageContext);
  const [data, setData] = useState();
  const state = useSelector((state) => state.GetAllData);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "serviceName",
      headerName: context.language === "ar" ? "اسم الخدمه" : "Service Name",
      flex: 1,
      valueGetter: (value) => value.row.serviceName,
    },
    {
      field: "counter",
      headerName: context.language === "en" ? "Counter" : "العدد",
      flex: 1,
      valueGetter: (value) => value.row.counter,
    },
  ];
  const clientColumns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "clientName",
      headerName: context.language === "ar" ? "اسم العميل" : "Client Name",
      flex: 1,
      valueGetter: (value) =>
        `${value.row.clientFirstName} ${value.row.clientLastName}`,
    },
    {
      field: "code",
      headerName: context.language === "en" ? "Client Code" : "كود العميل",
      flex: 1,
      valueGetter: (value) => value.row.clientCode,
    },
    {
      field: "counter",
      headerName: context.language === "en" ? "Counter" : "العدد",
      flex: 1,
      valueGetter: (value) => value.row.counter,
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetAllDataHandler()).then((res) => {
      if (res.payload.status === 200) {
        setData(res.payload.data);
      }
    });
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title={context.language === "en" ? "DASHBOARD" : "لوحه التحكم"}
          subtitle={
            context.language === "en"
              ? "Welcome to your dashboard"
              : "اهلا وسهلا بك في لوحه التحكم"
          }
        />
        {/* 
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        {state.loading ? (
          <Skeleton
            sx={{
              p: "1.25rem 1rem",
              flex: "1 1 100%",
              gridColumn: "span 2",
              gridRow: "span 1",
              borderRadius: "0.55rem",
            }}
            variant="rectangular"
            height={157}
          />
        ) : (
          <StatBox
            title={context.language === "en" ? "Total Clients" : "جميع العملاء"}
            value={data ? data.Clients.totalClients : 0}
            increase={`${data ? Math.round(data.Clients.percentage) : 0}%`}
            description="All Clients"
            icon={
              <MovingOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        )}
        {state.loading ? (
          <Skeleton
            sx={{
              p: "1.25rem 1rem",
              flex: "1 1 100%",
              gridColumn: "span 2",
              gridRow: "span 1",
              borderRadius: "0.55rem",
            }}
            variant="rectangular"
            height={157}
          />
        ) : (
          <StatBox
            title={context.language === "en" ? "Income" : "المكسب"}
            value={data ? data.InCome.currentMonth : 0}
            increase={`${data ? Math.round(data.InCome.percentage) : 0}%`}
            description={`${
              context.language === "en" ? "Last Month" : "الشهر السابق"
            } (${
              data ? data.InCome.totalInCome - data.InCome.currentMonth : 0
            })`}
            icon={
              <PointOfSale
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        )}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <BarChart />
        </Box>
        {state.loading ? (
          <Skeleton
            sx={{
              p: "1.25rem 1rem",
              flex: "1 1 100%",
              gridColumn: "span 2",
              gridRow: "span 1",
              borderRadius: "0.55rem",
            }}
            variant="rectangular"
            height={157}
          />
        ) : (
          <StatBox
            title={context.language === "en" ? "New Clients" : "عملاء جدد"}
            value={data ? data.clients.totalClients : 0}
            increase={`${data ? Math.round(data.clients.percentage) : 0}%`}
            description={`${
              context.language === "en" ? "Last Month" : "الشهر السابق"
            } (${
              data ? data.clients.totalClients - data.clients.currentMonth : 0
            })`}
            icon={
              <PersonAdd
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        )}
        {state.loading ? (
          <Skeleton
            sx={{
              p: "1.25rem 1rem",
              flex: "1 1 100%",
              gridColumn: "span 2",
              gridRow: "span 1",
              borderRadius: "0.55rem",
            }}
            variant="rectangular"
            height={157}
          />
        ) : (
          <StatBox
            title={context.language === "en" ? "Orders" : "طلبات"}
            value={data ? data.orders.currentMonth : 0}
            increase={`${data ? Math.round(data.orders.percentage) : 0}%`}
            description={`${
              context.language === "en" ? "Last Month" : "الشهر السابق"
            } (${
              data ? data.orders.totalOrders - data.orders.currentMonth : 0
            })`}
            icon={
              <LocalShippingOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        )}

        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            localeText={context.language === "ar" && arabicLocaleText}
            loading={state.loading}
            autoPageSize
            checkboxSelection
            rows={
              (data &&
                data.Services.map((service, index) => ({
                  id: index + 1,
                  ...service,
                }))) ||
              []
            }
            columns={columns.map((column, index) => ({
              ...column,
              renderCell: (params) => {
                const position = params.row.id;
                let textColor = "black";

                if (position === 1) {
                  textColor = "gold";
                } else if (position === 2) {
                  textColor = "silver";
                } else if (position === 3) {
                  textColor = "#cd7f32";
                }

                return <div style={{ color: textColor }}>{params.value}</div>;
              },
            }))}
          />
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            autoPageSize
            localeText={context.language === "ar" && arabicLocaleText}
            loading={state.loading}
            checkboxSelection
            rows={
              (data &&
                data.TopClients.map((client, index) => ({
                  id: index + 1,
                  ...client,
                }))) ||
              []
            }
            columns={clientColumns.map((column, index) => ({
              ...column,
              renderCell: (params) => {
                const position = params.row.id;
                let textColor = "black";
                if (position === 1) {
                  textColor = "gold";
                } else if (position === 2) {
                  textColor = "silver";
                } else if (position === 3) {
                  textColor = "#cd7f32";
                }

                return <div style={{ color: textColor }}>{params.value}</div>;
              },
            }))}
          />
        </Box>
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
  noRowsLabel: "لا توجد نتائج",
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

export default Dashboard;
