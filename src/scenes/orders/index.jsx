import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { LanguageContext } from "language";
import { useDispatch, useSelector } from "react-redux";
import { GetOrdersHandler } from "apis/Orders/GetOrders";
import {
  AddOutlined,
  CheckOutlined,
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { DeleteOrderHandler } from "apis/Orders/DeleteOrders";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ChangeDoneHanlder } from "apis/Orders/ChangeDone";
const Orders = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const isAdmin = cookies.get('_auth_role') === 'Admin';
  const state = useSelector((state) => state.DeleteOrder);
  const loading = useSelector((state) => state.GetAllOrders.loading);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "لاسم",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter: (value) =>
        value.row.client.full_name
        
    },
    {
      field: "date",
      headerName: context.language === "en" ? "Date" : "التاريخ",
      flex: 0.5,
      valueGetter: ({row}) => row.date.substring(0,10),
      cellClassName: "custom-cell-class"
    },
    {
      field: "time",
      headerName: context.language === "en" ? "Time" : "الوقت",
      flex: 0.5,
      valueGetter: ({row}) => row.date.substring(11,19),
      cellClassName: "custom-cell-class"
    },
    {
      field: "service_name",
      headerName: context.language === "en" ? "Service" : "الخدمه",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter: (value) => value.row.service.name,
    },
    {
      field: 'doctor',
      headerName: context.language === "en" ? "Doctor" : "الطبيب",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter : (value) => value.row.doctor.name
    },
    {
      field: 'assistances',
      headerName: context.language === "en" ? "Assistances" : "المساعدين",
      flex: 0.5,
      cellClassName: "custom-cell-class",
      valueGetter : (value) => value.row.assistances[0].name
    },
    {
      field: "amount_paid",
      headerName: context.language === "en" ? "Amount Paid" : "المدفوع",
      flex: 0.5,
      valueGetter: (value) => value.row.amount_paid,
      cellClassName: "custom-cell-class"
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
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row: { _id, done } }) => {
        return (
          <>
            <IconButton
              disabled={done ? true : false}
              onClick={() => {
                handleDone(_id);
              }}
            >
              <CheckOutlined
                sx={done ? { color: "grey" } : { color: "#00D2FF" }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                navigator(`/order/${_id}`);
              }}
            >
              <Visibility sx={{ color: "white" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDelete(_id);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </>
        );
      },
    }
  ];

  const handleDone = (id) => {
    dispatch(ChangeDoneHanlder({ id })).then((res) => {
      if (res.payload.status === 201) {
        dispatch(GetOrdersHandler()).then((res) => {
          if (res.payload.status === 200) {
            setRows(res.payload.data.orders);
          }
        });
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(DeleteOrderHandler({ id })).then((res) => {
      if (res.payload.status === 200) {
        dispatch(GetOrdersHandler()).then((res) => {
          if (res.payload.status === 200) {
            setRows(res.payload.data.orders);
          }
        });
      }
    });
  };

  useEffect(() => {
    dispatch(GetOrdersHandler()).then((res) => {
      if (res.payload.status === 200) {
        setRows(res.payload.data.orders);
      }
    });
  }, [dispatch]);
  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexDirection={{xs: 'column' , md: 'row'}}
        alignItems={"center"}
        gap={{xs: 2, md: 0}}
      >
        <Header
          title={context.language === "en" ? "Appointments" : "المواعيد"}
          subtitle={
            context.language === "en"
              ? "Entire list of Appointments"
              : "قائمه المواعيد"
          }
        />
        <Box display={"flex"} gap={2}>
          <Button
            sx={{
              backgroundColor: theme.palette.primary[500],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/addorder")}
          >
            {context.language === "en" ? "ADD APPOINTMENT" : "اضافه موعد"}
            <AddOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box
        mt="40px"
        height="75vh"
      >
        <DataGrid
          autoPageSize
          disableSelectionOnClick
          
          loading={loading}
          localeText={context.language === "en" ? null : arabicLocaleText}
          components={{ Toolbar: GridToolbar }}
          rows={rows.map((user, index) => ({
            id: index + 1,
            ...user,
          }))}
          columns={isAdmin ? columns : columns.filter(column => column.field !== 'actions')}
        />
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
export default Orders;
