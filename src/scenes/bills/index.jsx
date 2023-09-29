import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
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
  SellOutlined,
  CloseOutlined,
  MoreVertOutlined,
  FavoriteOutlined,
  ShareOutlined,
  TodayOutlined,
  CreditCardOutlined,
} from "@mui/icons-material";
import { DeleteStaffHandler } from "apis/data/Staff/DeleteStaff";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ResetAttendanceHandler } from "apis/data/Staff/ResetAttendance";
import { AddAttendanceHandler } from "apis/data/Staff/AddAttendance";
import { Formik } from "formik";
import { ResetAllAttendanceHandler } from "apis/data/Staff/ResetAllAttendance";
import { GetStaffOrderHandler } from "apis/data/Staff/GetOrderForStaff";
import { GetBillsHandler } from "apis/Bills/GetBills";
import { DeleteBillHandler } from "apis/Bills/DeleteBill";
import { AddBillHandler } from "apis/Bills/AddBill";
import { EditBillHandler } from "apis/Bills/EditBill";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PayBillHandler } from "apis/Bills/PayBills";

const Bills = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const context = useContext(LanguageContext);
  const [isOpen, setisOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [dates, setDates] = useState([]);
  const cookies = new Cookies();
  const [orderDetail, setOrderDetail] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [id, setId] = useState();
  const [payOpen, setPayOpen] = useState(false);
  const [date, setDate] = useState(dayjs(new Date()));
  const [orders, setOrders] = useState([]);
  const loading = useSelector((state) => state.GetBills.loading);
  const [time, setTime] = useState(dayjs(new Date()));
  const [notes, setNotes] = useState();
  const isArabic = context.language === "ar";
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "لاسم",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: context.language === "en" ? "Price" : "السعر",
      flex: 0.5,
    },
    {
      field: "dates",
      headerName: context.language === "en" ? "Date" : "تاريخ",
      flex: 0.5,
      renderCell: ({ row: { dates } }) => {
        return (
          <IconButton
            disabled={!dates.length ? true : false}
            onClick={() => {
              setDates(dates);
              setisOpen(true);
            }}
          >
            <TodayOutlined />
          </IconButton>
        );
      },
    },

    {
      field: "actions",
      headerName: context.language === "en" ? "Actions" : "الاجرائات",
      flex: 0.5,
      renderCell: ({ row: { _id, name, type, orders } }) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                setId(_id);
                setPayOpen(true);
              }}
            >
              <CreditCardOutlined sx={{ color: theme.palette.primary[400] }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setId(_id);
                setEditOpen(true);
              }}
            >
              <Edit sx={{ color: "#00D2FF" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOrderDetail({ _id, name });
                setFormOpen(true);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  const day = date.$D;
  const year = date.$y;
  const month = date.$M + 1;
  const hour = time.$H;
  console.log(hour);
  const minute = time.$m;

  const handlePay = () => {
    const date = new Date(year, month - 1, day, hour + 3, minute);
    dispatch(PayBillHandler({ date, id, notes })).then((res) => {
      if (res.payload.status === 200) {
        setPayOpen(false);
        dispatch(GetBillsHandler()).then((res) => {
          if (res.payload) {
            if (res.payload.status === 200) {
              setRows(res.payload.data.bills);
            }
          }
        });
      }
    });
  };

  const handleAdd = () => {
    dispatch(AddBillHandler({ name, price })).then((res) => {
      if (res.payload.status === 201) {
        setAddOpen(false);
        setRows([...rows, res.payload.data.bill]);
      }
    });
  };

  const handleEdit = () => {
    dispatch(EditBillHandler({ id, name })).then((res) => {
      if (res.payload.status === 201) {
        setEditOpen(false);
        setRows(
          rows.map((row) => {
            if (row._id === id) {
              return res.payload.data.bill;
            } else {
              return row;
            }
          })
        );
      }
    });
  };

  const handleDelete = (_id) => {
    setFormOpen(!formOpen);
    dispatch(DeleteBillHandler({ _id })).then((res) => {
      if (res.payload.status === 200) {
        setFormOpen(false);
        setRows(rows.filter((row) => row._id !== _id));
      }
    });
  };

  useEffect(() => {
    dispatch(GetBillsHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.bills);
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
          title={context.language === "en" ? "BILLS" : "الفواتير"}
          subtitle={
            context.language === "en" ? "List Of Bills" : "قائمه الفواتير"
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
            onClick={() => setAddOpen(true)}
          >
            {context.language === "en" ? "ADD BILL" : "اضافه فاتوره"}
            <AddOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box mt="40px" height="75vh">
        <DataGrid
          autoPageSize
          disableSelectionOnClick
          checkboxSelection
          loading={loading}
          localeText={context.language === "en" ? null : arabicLocaleText}
          components={{ Toolbar: GridToolbar }}
          rows={rows.map((user, index) => ({
            id: index + 1,
            ...user,
          }))}
          columns={columns}
        />
      </Box>
      <Dialog
      dir={isArabic && "rtl"}
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isArabic ? "حذف" : "Delete"} <span style={{ color: "red" }}>{orderDetail.name}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isArabic ? "هل انت متأكد بأنك تريد حذف هذه الفاتوره؟" : "Are you sure you want to delete this bill?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(!formOpen)}>
            {isArabic ? "ألغاء" : "Cancel"}
          </Button>
          <Button
            onClick={() => handleDelete(orderDetail._id)}
            autoFocus
            color="error"
          >
            {isArabic ? "حذف" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => setisOpen(!isOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <IconButton
            onClick={() => {
              setisOpen(false);
              setOrders([]);
            }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} flexWrap={"wrap"} gap={20}>
            {dates ? (
              dates.map((date) => (
                <Card sx={{ width: 345, maxWidth: 345 }}>
                  <Box
                    display={"flex"}
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    gap={2}
                    p={3}
                  >
                    <Typography>
                      {date.notes ? `Notes : ${date.notes}` : "No Notes"}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Date : {date.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
              >
                No Date Found
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        dir={context.language === "ar" && "rtl"}
        open={addOpen}
        onClose={() => setAddOpen(!addOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en"
            ? "Add a new bill!"
            : "أضافه فاتوره جديده!"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogContentText>
            {context.language === "en"
              ? "Please fill the info below :"
              : "برجاء ادخال البيانات الاتيه :"}
          </DialogContentText>
          <TextField
            placeholder={context.language === "en" ? "Name" : "الاسم"}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Price" : "السعر"}
            onChange={(e) => setPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(!addOpen)}>
            {" "}
            {context.language === "en" ? "Cancel" : "ألغاء"}
          </Button>
          <Button onClick={() => handleAdd()} autoFocus color="success">
            {context.language === "en" ? "Add" : "أضافه"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        dir={context.language === "ar" && "rtl"}
        open={editOpen}
        onClose={() => setEditOpen(!editOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en" ? "Edit bill!" : "تعديل فاتوره!"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogContentText>
            {context.language === "en"
              ? "Please fill the info below :"
              : "برجاء ملئ البيانات بالأسفل : "}
          </DialogContentText>
          <TextField
            placeholder={context.language === "en" ? "Name" : "الاسم"}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(!editOpen)}>
            {context.language === "en" ? "Cancel" : "ألغاء"}
          </Button>
          <Button onClick={() => handleEdit()} autoFocus color="success">
            {context.language === "en" ? "Edit" : "تعديل"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        dir={isArabic && "rtl"}
        open={payOpen}
        onClose={() => setPayOpen(!payOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{isArabic ? "دفع فاتوره!" : "Pay bill!"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogContentText>{isArabic ? "برجاء ادخال البيانات الاتيه" : "Please fill the info below :"}</DialogContentText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs(new Date())}
              value={date}
              onChange={(value) => {
                setDate(value);
              }}
            />
            <TimePicker
              defaultValue={dayjs(new Date())}
              value={time}
              onChange={(value) => {
                setTime(value);
              }}
            />
          </LocalizationProvider>
          <TextField
            placeholder={context.language === "en" ? "Notes" : "ملحوظات"}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayOpen(!payOpen)}>
            {isArabic ? "ألغاء" : "Cancel"}
          </Button>
          <Button onClick={() => handlePay()} autoFocus color="success">
            {isArabic ? "دفع" : "Pay"}
          </Button>
        </DialogActions>
      </Dialog>
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
export default Bills;
