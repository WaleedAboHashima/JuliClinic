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
  MenuItem,
  Select,
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
} from "@mui/icons-material";
import { DeleteStaffHandler } from "apis/data/Staff/DeleteStaff";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ResetAttendanceHandler } from "apis/data/Staff/ResetAttendance";
import { AddAttendanceHandler } from "apis/data/Staff/AddAttendance";
import { Formik } from "formik";
import { ResetAllAttendanceHandler } from "apis/data/Staff/ResetAllAttendance";
import { GetStaffOrderHandler } from "apis/data/Staff/GetOrderForStaff";

const Staff = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const context = useContext(LanguageContext);
  const [isOpen, setisOpen] = useState(false);
  const [userdetails, setUserdetails] = useState({});
  const loading = useSelector((state) => state.GetStaff.loading);
  const cookies = new Cookies();
  const [type, setType] = useState(0);
  const navigator = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState();
  const [salary, setSalary] = useState();
  const [percentage, setPercentage] = useState();
  const [way, setWay] = useState("fixed");

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
      field: "type",
      headerName: context.language === "en" ? "Type" : "النوع",
      flex: 1,
      renderCell: ({ row: { type } }) => {
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
                  : "خدمه عملاء"
                : type === "ASSISTANT"
                ? context.language === "en"
                  ? "Assitant"
                  : "مساعد"
                : type === "RECIPTIONST"
                ? context.language === "en"
                  ? "Receptionist"
                  : "مستقبل"
                : context.language === "en"
                ? "Other"
                : "اخري"}
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
        if (row.salary) {
          return row.salary;
        } else if (row.percentage) {
          return row.percentage * 100 + "%";
        } else {
          return "____________";
        }
      },
    },
    {
      field: "attendanceCount",
      headerName: context.language === "en" ? "Attendance" : "الحضور",
      flex: 0.5,
    },

    {
      field: "OrderCount",
      headerName: context.language === "en" ? "Orders count" : "عدد الطلبات",
      flex: 0.5,
      valueGetter: ({ row: { OrderCount } }) => {
        if (OrderCount) return OrderCount;
        else return "____________";
      },
    },
    {
      field: "actions",
      headerName: context.language === "en" ? "Actions" : "الاجرائات",
      flex: 0.5,
      renderCell: ({
        row: { _id, name, type, orders, salary, percentage, way },
      }) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                setWay(way);
                setUserdetails({ _id, name, salary, percentage });
                setEditOpen(true);
              }}
            >
              <Edit sx={{ color: "#00D2FF" }} />
            </IconButton>
            <IconButton
              disabled={!orders || !orders.length ? true : false}
              onClick={() => getStaffOrders(_id, type.toLowerCase())}
            >
              <SellOutlined />
            </IconButton>
            <IconButton
              onClick={() => {
                setUserdetails({ _id, name });
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

  const getStaffOrders = async (_id, type) => {
    dispatch(GetStaffOrderHandler({ _id, type })).then((res) => {
      if (res.payload.status === 200) {
        setOrders(res.payload.data.staffOrders);
        setisOpen(true);
      }
    });
  };

  const handleEdit = () => {
    dispatch();
  };

  const handleDelete = (_id) => {
    setFormOpen(!formOpen);
    dispatch(DeleteStaffHandler({ _id })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          dispatch(GetStaffHandler()).then((res) => {
            setRows(res.payload.data.StaffList);
          });
        }
      }
    });
  };

  useEffect(() => {
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.StaffList);
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
          title={context.language === "en" ? "EMPLOYEES" : "العملاء"}
          subtitle={
            context.language === "en" ? "List Of Employees" : "قائمه العملاء"
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
            onClick={() => navigator("/addemployee")}
          >
            {context.language === "en" ? "ADD EMPLOYEE" : "اضافه موظف"}
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
        dir={context.language === "en" ? "ltr" : "rtl"}
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en" ? (
            <Box>
              Delete <span style={{ color: "red" }}>{userdetails.name}?</span>
            </Box>
          ) : (
            <Box>
              حذف <span style={{ color: "red" }}>{userdetails.name}؟</span>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {context.language === "en"
              ? "Are you sure you want to delete this employee?"
              : "هل انت متأكد بأنك تريد ازاله هذا الموظف؟"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(!formOpen)}>
            {" "}
            {context.language === "en" ? "Cancel" : "الغاء"}
          </Button>
          <Button
            onClick={() => handleDelete(userdetails._id)}
            autoFocus
            color="error"
          >
            {context.language === "en" ? "Delete" : "حذف"}
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
          justifyContent={"space-between"}
        >
          <span style={{ color: "white" }}>
            Orders for the user : {userdetails.name}
          </span>
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
            {orders ? (
              orders.map((order) => (
                <Card sx={{ width: 345, maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "white" }} aria-label="recipe">
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertOutlined />
                      </IconButton>
                    }
                    title={order.service.name}
                    subheader={order.amount_paid}
                  />
                  <Box
                    display={"flex"}
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    gap={3}
                    p={3}
                  >
                    <Typography>
                      Client Name :{" "}
                      {`${order.client.firstName} ${order.client.middleName} ${order.client.lastName}`}
                    </Typography>
                    <Typography>Client Code : {order.client.code}</Typography>
                    <Typography>Doctors : {order.doctor.name}</Typography>
                    <Typography>
                      Assistances :{" "}
                      {order.assistances.map((assistance) => assistance.name)}
                    </Typography>
                    <Typography>
                      Addtional Info :
                      <br />
                      {order.addtionalInfo.map((info) => {
                        const keyValuePairs = Object.entries(info);
                        const result = keyValuePairs.map(
                          ([key, value], index) => (
                            <Box key={index} display={"flex"}>
                              <Typography>
                                {key} : {value}
                              </Typography>
                            </Box>
                          )
                        );
                        return result;
                      })}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Time : {order.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date : {order.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Finished : {order.done ? "Yes" : "No"}
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
                No Orders Found
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
      dir={context.language === "en" ? "ltr" : "rtl"}
        open={editOpen}
        onClose={() => setEditOpen(!editOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" >
          {context.language === "en" ? (
            <Box>
              Edit{" "}
              <span style={{ color: theme.palette.primary[400] }}>
                {userdetails.name}?
              </span>
            </Box>
          ) : (
            <Box>
            تعديل{" "}
            <span style={{ color: theme.palette.primary[400] }}>
              {userdetails.name}؟
            </span>
          </Box>
          )}
        </DialogTitle>
        <DialogContent>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            flexDirection={"column"}
          >
            <TextField
              fullWidth
              dir={context.language === "en" ? "ltr" : "rtl"}
              placeholder={
                context.language === "en"
                  ? `Name: ${userdetails.name}`
                  : `الاسم: ${userdetails.name}`
              }
              onChange={(e) => setName(e.target.value)}
            />
            {way === "fixed" ? (
              <TextField
                dir={context.language === "en" ? "ltr" : "rtl"}
                fullWidth
                placeholder={
                  context.language === "en"
                    ? `Salary: ${userdetails.salary}`
                    : `المرتب: ${userdetails.salary}`
                }
                onChange={(e) => setSalary(e.target.value)}
              />
            ) : (
              <TextField
                dir={context.language === "en" ? "ltr" : "rtl"}
                fullWidth
                placeholder={
                  context.language === "en"
                    ? `Percentage %: ${userdetails.percentage}`
                    : `النسبه : ${userdetails.percentage} %`
                }
                onChange={(e) => setPercentage(e.target.value)}
              />
            )}
            <Select
            sx={context.language === "ar" &&{ 
              "& .MuiSvgIcon-root" : {
                left: '7px',
                right: 'auto'
              }
            }}
              fullWidth
              value={way}
              onChange={(e) => setWay(e.target.value)}
            >
              <MenuItem dir={context.language === "en" ? "ltr" : "rtl"} value={"fixed"}>
                {context.language === "en" ? "Fixed" : "ثابت"}
              </MenuItem>
              <MenuItem dir={context.language === "en" ? "ltr" : "rtl"} value={"com"}>
                {context.language === "en" ? "Commission" : "عموله"}
              </MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(!editOpen)}>
            {" "}
            {context.language === "en" ? "Cancel" : "الغاء"}
          </Button>
          <Button onClick={() => handleEdit()} autoFocus color="success">
            {context.language === "en" ? "Edit" : "تعديل"}
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

export default Staff;
