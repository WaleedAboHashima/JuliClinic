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
  Edit,
} from "@mui/icons-material";
import { GetUsersHandler } from "apis/data/Users/GetUsers";
import Cookies from "universal-cookie";
import { DeleteUserHandler } from "apis/data/Users/DeleteUser";
import { useNavigate } from "react-router-dom";
import { EditUsersHandler } from "apis/data/Users/EditUser";
const Users = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const context = useContext(LanguageContext);
  const isArabic = context.language === 'ar';
  const userState = useSelector((state) => state.GetUsers);
  const cookies = new Cookies();
  const [email, setEmail] = useState("");
  const navigator = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "username",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 0.5,
    },
    {
      field: context.language === "en" ? "email" : "الايميل",
      headerName: "Email",
      flex: 0.5,
    },
    {
      field: context.language === "en" ? "role" : "النوع",
      headerName: "role",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            p="5px"
            display="flex"
            backgroundColor={
              role === "Admin"
                ? theme.palette.mode === "dark"
                  ? theme.palette.primary[800]
                  : theme.palette.primary[200]
                : role === "Doctor"
                ? theme.palette.primary[600]
                : role === "User"
                ? theme.palette.secondary[700]
                : theme.palette.secondary[700]
            }
            borderRadius="4px"
          >
            {role === "Admin" ? (
              <SecurityOutlined />
            ) : role === "DOCTOR" ? (
              <LocalHospitalOutlined />
            ) : role === "5000" ? (
              <CurrencyPound />
            ) : (
              <PersonOutlineOutlined />
            )}
            <Typography color={theme.palette.grey[100]} sx={{ ml: "5px" }}>
              {role === "Admin"
                ? context.language === "en"
                  ? "Admin"
                  : "ادمن"
                : role === "User"
                ? context.language === "en"
                  ? "User"
                  : "مستخدم"
                : role === "CALL_CENTER2"
                ? context.language === "en"
                  ? "Accountant"
                  : "محاسب"
                : context.language === "en"
                ? "Doctor"
                : "دكتور"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row: { username, _id } }) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setUserDetails({ _id, username });
                setIsOpen(true);
              }}
            >
              <Edit color="primary" />
            </IconButton>
            <IconButton
              onClick={() => {
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

  const handleDelete = (_id) => {
    setFormOpen(!formOpen);
    dispatch(DeleteUserHandler({ _id })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          dispatch(GetUsersHandler()).then((res) => {
            setRows(res.payload.data.users);
            setUserDetails("");
          });
        }
      }
    });
  };

  const handleEdit = () => {
    dispatch(EditUsersHandler({_id: userDetails._id, email })).then((res) => {
      if (res.payload.status === 200) {
        setIsOpen(!isOpen);
        dispatch(GetUsersHandler()).then((res) => {
          if (res.payload) {
            if (res.payload.status === 200) {
              setRows(res.payload.data.users);
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    dispatch(GetUsersHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.users);
        }
      }
    });
  }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={context.language === "en" ? "USERS" : "مستخدمون"}
          subtitle={
            context.language === "en" ? "List of users" : "قائمه المستخدمون"
          }
        />
        <Box display={"flex"} gap={2}>
          <Button
            sx={{
              display:
                cookies.get("_auth_role") === "Admin" ? "inlineblock" : "none",
              backgroundColor: theme.palette.primary[600],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/adduser")}
          >
            {context.language === "en" ? "Add Users" : "اضافه مستخدمون"}
            <AddOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box
        mt="40px"
        height="75vh"
        // sx={{
        //   "& .MuiDataGrid-root": {
        //     border: "none",
        //   },
        //   "& .MuiDataGrid-cell": {
        //     borderBottom: "none",
        //   },
        //   "& .MuiDataGrid-columnHeaders": {
        //     backgroundColor: theme.palette.background.alt,
        //     color: theme.palette.secondary[100],
        //     borderBottom: "none",
        //   },
        //   "& .MuiDataGrid-virtualScroller": {
        //     backgroundColor: theme.palette.primary.light,
        //   },
        //   "& .MuiDataGrid-footerContainer": {
        //     backgroundColor: theme.palette.background.alt,
        //     color: theme.palette.secondary[100],
        //     borderTop: "none",
        //   },
        //   "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
        //     color: `${theme.palette.secondary[200]} !important`,
        //   },
        //   "& .MuiDataGrid-toolbarContainer": {
        //     backgroundColor: theme.palette.primary[500],
        //   },
        // }}
      >
          <DataGrid
            autoPageSize
            disableSelectionOnClick
            
            localeText={context.language === "en" ? null : arabicLocaleText}
            loading={userState.loading}
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
      </Box>
      <Dialog
      dir={isArabic && "rtl"}
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isArabic ? "حذف" : "Delete"} <span style={{ color: "red" }}>{userDetails.username}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isArabic ? "هل انت متأكد بانك تريد حذف هذا المستخدم؟ " : "Are you sure you want to delete this user?"}
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
      dir={isArabic && 'rtl'}
        open={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isArabic ? "تعديل" : "Edit"} <span style={{ color: "primary" }}>{userDetails.username}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{isArabic ? "تعديل البريد الالكتروني لهذا المستخدم :" : "Edit the email of this user :"}</DialogContentText>
          <TextField
            placeholder={
              context.language === "en" ? "Email" : "البريد الالكتروني"
            }
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(!isOpen)}>{isArabic ? "ألغاء" : "Cancel"}</Button>
          <Button
            onClick={() => handleEdit()}
            autoFocus
            color="success"
          >
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

export default Users;
