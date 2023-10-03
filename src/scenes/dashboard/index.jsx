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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import StatBox from "components/StatBox";
import { LanguageContext } from "language";
import BarChart from "components/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { GetAllDataHandler } from "apis/dashboard/DashboardData";
import { GetOrdersHandler } from "apis/Orders/GetOrders";
import PieChart from "components/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const context = useContext(LanguageContext);
  const [data, setData] = useState();
  const state = useSelector((state) => state.GetAllData);
  const [orders, setOrders] = useState([]);
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
  const ordersColumns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "لاسم",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter: (value) => value.row.client.full_name,
    },
    {
      field: "date",
      headerName: context.language === "en" ? "Date" : "التاريخ",
      flex: 0.5,
      valueGetter: ({ row }) => row.date.substring(0, 10),
      cellClassName: "custom-cell-class",
    },
    {
      field: "time",
      headerName: context.language === "en" ? "Time" : "الوقت",
      flex: 0.5,
      valueGetter: ({ row }) => row.date.substring(11, 19),
      cellClassName: "custom-cell-class",
    },
    {
      field: "service_name",
      headerName: context.language === "en" ? "Service" : "الخدمه",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter: (value) => value.row.service.name,
    },
    {
      field: "amount_paid",
      headerName: context.language === "en" ? "Amount Paid" : "المدفوع",
      flex: 0.5,
      valueGetter: (value) => value.row.amount_paid,
      cellClassName: "custom-cell-class",
    },
    {
      field: "currency",
      headerName: context.language === "en" ? "Currency" : "العمله",
      cellClassName: "custom-cell-class",
      flex: 0.5,
    },
    {
      field: "done",
      headerName: context.language === "en" ? "Finished" : "انتهي",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter: (value) =>
        value.row.done
          ? context.language === "en"
            ? "Finished"
            : "انتهي"
          : context.language === "en"
          ? "Not Finished"
          : "لم تنتهي",
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetAllDataHandler()).then((res) => {
      if (res.payload.status === 200) {
        setData(res.payload.data);
      }
      dispatch(GetOrdersHandler()).then((res) => {
        setOrders(res.payload.data.orders);
      });
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
          <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <Header
              title={
                context.language === "en" ? "Orders Table" : "جدول الطلبات"
              }
            />
            <DataGrid
              autoPageSize
              disableSelectionOnClick
              loading={state.loading}
              localeText={context.language === "en" ? null : arabicLocaleText}
              rows={orders.slice(0, 5).map((user, index) => ({
                id: index + 1,
                ...user,
              }))}
              columns={ordersColumns}
            />
          </Box>
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
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
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
          <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <Header
              title={
                context.language === "en" ? "Top Services" : "اكثر الخدمات طلبا"
              }
            />
            <DataGrid
              localeText={context.language === "ar" && arabicLocaleText}
              loading={state.loading}
              autoPageSize
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
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
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
          <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <Header
              title={
                context.language === "en" ? "Top Clients" : "اكثر العملاء شراءا"
              }
            />
            <DataGrid
              autoPageSize
              localeText={context.language === "ar" && arabicLocaleText}
              loading={state.loading}
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
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p={"1rem"}
          borderRadius="0.55rem"
        >
          <Header title={context.language === 'en' ? "Services Chart" : "رسم الخدمات"} />
          <PieChart />
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p={"1rem"}
          borderRadius="0.55rem"
        >
          <Header title={"Services Chart"} />
          <BarChart />
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
