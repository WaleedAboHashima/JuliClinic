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
import { LanguageContext } from "language";
import {
  Delete,
  AddOutlined,
  CloseOutlined,
  MoreVertOutlined,
  Search,
  Edit,
} from "@mui/icons-material";
import Cookies from "universal-cookie";
import { GetClientsHandler } from "apis/data/Clients/GetClients";
import { Formik } from "formik";
import { SearchClientHandler } from "apis/data/Clients/SearchClients";
import { EditClientHandler } from "apis/data/Clients/EditClient";
import { DeleteClientHandler } from "apis/data/Clients/DeleteClient";
import { useNavigate } from "react-router-dom";
import { countries, egyptGovernorates } from "constant";

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
  const [fullName, setFullName] = useState();
  const [phone, setPhone] = useState();
  const [selectedCountry, setSelectedCountry] = useState("none");
  const [selectedGovernment, setSelectedGovernment] = useState("none");
  const [orders, setOrders] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "full_name",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
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
    {
      field: "code",
      headerName: context.language === "en" ? "Code" : "الكود",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row: { full_name, phone, country, _id } }) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setUserDetails({
                  full_name,
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
                setUserDetails({ _id, fullName });
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
        fullName,
        phone,
        country: selectedCountry,
        governorate: selectedGovernment,
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        paddingX={2} // Adjust padding as needed
      >
        {/* Header */}
        <Header
          title={context.language === "en" ? "Clients" : "عملاء"}
          subtitle={
            context.language === "en" ? "List of clients" : "قائمه العملاء"
          }
        />
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }} // Adjust the layout for different screen sizes
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          marginBottom={2} // Add margin between elements
        >
          <Box marginBottom={{ xs: 2, sm: 0 }}>
            {" "}
            {/* Adjust margin */}
            <Formik
              initialValues={{ code: "" }}
              onSubmit={() => handleSearch()}
            >
              {({ handleSubmit, handleChange, values }) => (
                <form onSubmit={handleSubmit}>
                  <InputBase
                    name="code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
          </Box>
          <Button
            sx={{
              backgroundColor: theme.palette.primary[600],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
              marginLeft: { xs: 0, sm: 2 }, // Adjust margin
            }}
            onClick={() => navigator("/addclient")}
          >
            {context.language === "en" ? "Add Client" : "اضافه عملاء"}
            <AddOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box mt="40px" height="75vh">
        <DataGrid
          autoPageSize
          disableSelectionOnClick
          localeText={context.language === "en" ? null : arabicLocaleText}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          rows={rows.map((user, index) => ({
            id: index + 1,
            ...user,
          }))}
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
            {isArabic
              ? "هل انت متأكد بأنك تريد حذف هذا المستخدم؟"
              : "Are you sure you want to delete this user?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(!formOpen)}>
            {isArabic ? "ألغاء" : "Cancel"}
          </Button>
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
            {`${userDetails.full_name}`}?
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
              dir={context.language === "en" ? "ltr" : "rtl"}
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              placeholder={context.language === "en" ? "First Name" : "الاسم"}
            />
            <TextField
              dir={context.language === "en" ? "ltr" : "rtl"}
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              placeholder={context.language === "en" ? "Phone" : "رقم الهاتف"}
            />
            {/* <Select
              MenuProps={MenuProps}
              onChange={(e) => setSelectedGovernment(e.target.value)}
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
              value={selectedGovernment}
              defaultValue={"none"}
            >
              <MenuItem
                disabled
                value="none"
                dir={context.language === "en" ? "ltr" : "rtl"}
              >
                {context.language === "en"
                  ? "Select a governement"
                  : "اختر محافظه"}
              </MenuItem>
              {egyptGovernorates.map((governement) => (
                <MenuItem
                dir={isArabic && 'rtl'}
                  value={governement.governorate}
                  key={governement.governorate}
                >
                  {isArabic
                    ? governement.governoratear
                    : governement.governorate}
                </MenuItem>
              ))}
            </Select> */}
            <Select
              MenuProps={MenuProps}
              onChange={(e) => setSelectedCountry(e.target.value)}
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
              value={selectedCountry}
              defaultValue={"none"}
            >
              <MenuItem
                disabled
                value="none"
                dir={context.language === "en" ? "ltr" : "rtl"}
              >
                {context.language === "en" ? "Select a country" : "اختر مدينه"}
              </MenuItem>
              {/* {egyptGovernorates
                .filter(
                  (government) => government.governorate === selectedGovernment
                )
                .map((gov) =>
                  !isArabic
                    ? gov.cities.map((city) => (
                        <MenuItem
                          dir={context.language === "en" ? "ltr" : "rtl"}
                          value={city}
                          key={city}
                        >
                          {city}
                        </MenuItem>
                      ))
                    : gov.citiesar.map((city) => (
                        <MenuItem
                          dir={context.language === "en" ? "ltr" : "rtl"}
                          value={city}
                          key={city}
                        >
                          {city}
                        </MenuItem>
                      ))
                )} */}
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
          <Button onClick={() => setEditOpen(!editOpen)}>
            {isArabic ? "ألغاء" : "Cancel"}
          </Button>
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
