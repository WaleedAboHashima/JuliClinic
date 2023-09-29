import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { LanguageContext } from "language";
import {
  AdminPanelSettingsOutlined,
  CurrencyPound,
  PersonOutlineOutlined,
  LocalHospitalOutlined,
  PhoneEnabledOutlined,
  SecurityOutlined,
  Delete,
  AddOutlined,
  Inventory2Outlined,
  CloseOutlined,
  MoreVertOutlined,
  Search,
  Edit,
} from "@mui/icons-material";
import { GetUsersHandler } from "apis/data/Users/GetUsers";
import Cookies from "universal-cookie";
import { DeleteUserHandler } from "apis/data/Users/DeleteUser";
import { GetClientsHandler } from "apis/data/Clients/GetClients";
import FlexBetween from "components/FlexBetween";
import { Formik } from "formik";
import { SearchClientHandler } from "apis/data/Clients/SearchClients";
import { EditClientHandler } from "apis/data/Clients/EditClient";
import { DeleteClientHandler } from "apis/data/Clients/DeleteClient";
import { useNavigate } from "react-router-dom";
import { countries } from "constant";

const Clients = () => {
  const theme = useTheme();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const context = useContext(LanguageContext);
  const userState = useSelector((state) => state.GetUsers);
  const loading = useSelector((state) => state.GetClients.loading);
  const cookies = new Cookies();
  const isAdmin = cookies.get("_auth_role") === "Admin";
  const [userDetails, setUserDetails] = useState({});
  const isArabic = context.language === "ar";
  const [formOpen, setFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [code, setCode] = useState();
  const [firstName, setFirstName] = useState();
  const [middleName, setMiddleName] = useState();
  const [lastName, setLastName] = useState();
  const [phone, setPhone] = useState();
  const [country, setCountry] = useState();
  const [orders, setOrders] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 0.5,
      valueGetter: ({ row }) =>
        `${row.firstName} ${row.middleName} ${row.lastName}`,
    },
    {
      field: "code",
      headerName: context.language === "en" ? "Code" : "الكود",
      flex: 0.5,
    },
    {
      field: "phone",
      headerName: context.language === "en" ? "Phone" : "الهاتف",
      flex: 0.5,
    },
    {
      field: "country",
      headerName: context.language === "en" ? "Country" : "المدينه",
      flex: 0.5,
    },
    // {
    //   field: "orders",
    //   headerName: context.language === "en" ? "Orders" : "الطلبات",
    //   flex: 0.5,
    //   renderCell: ({ row: { orders } }) => (
    //     <IconButton
    //       disabled={orders.length ? false : true}
    //       onClick={() => {
    //         setIsOpen(true);
    //         setOrders(orders);
    //       }}
    //     >
    //       <Tooltip
    //         title={context.language === "en" ? "View Orders" : "عرض الطلبات"}
    //       >
    //         <Inventory2Outlined />
    //       </Tooltip>
    //     </IconButton>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({
        row: { firstName, middleName, lastName, phone, country, _id },
      }) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setUserDetails({
                  firstName,
                  middleName,
                  lastName,
                  phone,
                  country,
                  _id,
                });
                setEditOpen(true);
              }}
            >
              <Tooltip
                title={
                  context.language === "en" ? "Edit User" : "تعديل المستخدم"
                }
              >
                <Edit color="primary" />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                const username = firstName + middleName + lastName;
                setUserDetails({ _id, username });
                setFormOpen(true);
              }}
            >
              <Delete color="error" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleEdit = () => {
    dispatch(
      EditClientHandler({
        firstName,
        middleName,
        lastName,
        phone,
        country,
        _id: userDetails._id,
      })
    ).then((res) => {
      if (res.payload.status === 200) {
        setEditOpen(false);
        setUserDetails({});
        dispatch(GetClientsHandler()).then((res) => {
          setRows(res.payload.data.clients);
        });
      }
    });
  };

  const handleDelete = (_id) => {
    setFormOpen(!formOpen);
    dispatch(DeleteClientHandler({ _id })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          dispatch(GetClientsHandler()).then((res) => {
            setRows(res.payload.data.clients);
          });
        }
      }
    });
  };

  const handleSearch = () => {
    dispatch(SearchClientHandler({ code })).then((res) => {
      if (res.payload.status === 200) {
        setRows(res.payload.data.client);
      }
    });
  };

  useEffect(() => {
    dispatch(GetClientsHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.clients);
        }
      }
    });
  }, [dispatch, code]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={context.language === "en" ? "Clients" : "عملاء"}
          subtitle={
            context.language === "en" ? "List of clients" : "قائمه العملاء"
          }
        />
        <Box>
          <FlexBetween>
            <Formik
              initialValues={{ code: "" }}
              onSubmit={() => handleSearch()}
            >
              {({ handleSubmit, handleChange, values }) => (
                <form onSubmit={handleSubmit}>
                  <InputBase
                    name="code"
                    required
                    value={values.code}
                    onChange={handleChange}
                    onChangeCapture={(e) => setCode(e.target.value)}
                    sx={{
                      backgroundColor: "transparent",
                      borderRadius: 1,
                      p: 1,
                      border: "1px solid #393E49",
                    }}
                    placeholder={
                      context.language === "en"
                        ? "Search Client Code.."
                        : "البحث عن كود العميل ..."
                    }
                  />
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </form>
              )}
            </Formik>
            <Button
              sx={{
                display:
                  cookies.get("_auth_role") === "Admin"
                    ? "inlineblock"
                    : "none",
                backgroundColor: theme.palette.primary[600],
                color: theme.palette.secondary[200],
                fontSize: "14px",
                fontWeight: "bold",
                p: "10px 20px",
              }}
              onClick={() => navigator("/addclient")}
            >
              {context.language === "en" ? "Add Client" : "اضافه عملاء"}
              <AddOutlined sx={{ mr: "10px" }} />
            </Button>
          </FlexBetween>
        </Box>
      </Box>
      <Box mt="40px" height="75vh">
        <DataGrid
          autoPageSize
          disableSelectionOnClick
          checkboxSelection
          localeText={context.language === "en" ? null : arabicLocaleText}
          loading={loading}
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
          columns={
            isAdmin
              ? columns
              : columns.filter((column) => column.field !== "actions")
          }
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
          {isArabic ? "حذف المستخدم" : "Delete a user"}{" "}
          <span style={{ color: "red" }}>{userDetails.username}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isArabic ? "هل انت متأكد بأنك تريد حذف هذا المستخدم؟" : "Are you sure you want to delete this user?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(!formOpen)}>{isArabic ? "ألغاء" : "Cancel"}</Button>
          <Button
            onClick={() => handleDelete(userDetails._id)}
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
        onClose={() => setIsOpen(!isOpen)}
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
              setIsOpen(false);
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
                <Card sx={{ width: 345, maxWidth: 345 }} key={order._id}>
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
        dir={isArabic && "rtl"}
        open={editOpen}
        onClose={() => setEditOpen(!editOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isArabic ? "تعديل" : "Edit"}{" "}
          <span style={{ color: theme.palette.primary[400] }}>
            {`${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`}
            ?
          </span>
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
              placeholder={
                context.language === "en" ? "First Name" : "اسم الاول"
              }
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder={
                context.language === "en" ? "Middle Name" : "الاسم الاوسط"
              }
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder={
                context.language === "en" ? "Last Name" : "اسم العائله"
              }
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder={context.language === "en" ? "Phone" : "الهاتف"}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Select
              MenuProps={MenuProps}
              onChange={(e) => setCountry(e.target.value)}
              dir={context.language === "en" ? "ltr" : "rtl"}
              sx={
                context.language === "ar" && {
                  "& .MuiSvgIcon-root": {
                    left: "7px",
                    right: "auto",
                  },
                }
              }
              fullWidth
              value={country}
              defaultValue={"none"}
            >
              <MenuItem
                disabled
                value="none"
                dir={context.language === "en" ? "ltr" : "rtl"}
              >
                {context.language === "en" ? "Select a country" : "اختر مدينه"}
              </MenuItem>
              {countries.map((country) => (
                <MenuItem
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  value={country.shortcut}
                >
                  {context.language === "en"
                    ? country.name
                    : country.arabicName}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(!editOpen)}>{isArabic ? "ألغاء" : "Cancel"}</Button>
          <Button onClick={() => handleEdit()} autoFocus color="success">
            {isArabic ? "تعديل" : "Edit"}
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
  noRowsLabel: "لا يوجد مستخدمون",
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

export default Clients;