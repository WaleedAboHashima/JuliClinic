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
import { Delete, Edit, AddOutlined } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { GetInventoryHandler } from "apis/Inventory/GetInventory";
import { DeleteItemHandler } from "apis/Inventory/DeleteItem";
import { EditItemHandler } from "apis/Inventory/EditItem";
import { AddItemHandler } from "apis/Inventory/AddItem";

const Inventory = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const context = useContext(LanguageContext);
  const [editOpen, setEditOpen] = useState(false);
  const [itemDetails, setItemsDetails] = useState({});
  const cookies = new Cookies();
  const [addOpen, setAddOpen] = useState(false);
  const [kind, setKind] = useState();
  const loading = useSelector((state) => state.GetInventory.loading);
  const [quantity, setQuantity] = useState();
  const [companyName, setCompanyName] = useState();
  const isArabic = context.language === 'ar';
  const [price, setPrice] = useState();
  const [notes, setNotes] = useState();
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "kind",
      headerName: context.language === "en" ? "Kind" : "النوع",
      flex: 0.5,
    },
    {
      field: "quantity",
      headerName: context.language === "en" ? "Quantity" : "الكميه",
      flex: 0.5,
    },
    {
      field: "company_name",
      headerName: context.language === "en" ? "Company Name" : "اسم الشركه",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: context.language === "en" ? "Price" : "السعر",
      flex: 0.5,
    },
    {
      field: "notes",
      headerName: context.language === "en" ? "Notes" : "ملاحظات",
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: context.language === "en" ? "Creation Date" : "تاريخ الأضافه",
      flex: 0.5,
      valueGetter: (value) => value.row.createdAt.substring(0, 10),
    },
    {
      field: "Actions",
      headerName: context.language === "en" ? "Actions" : "الاجراءات",
      flex: 0.5,
      renderCell: ({ row: { _id } }) => {
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              sx={{ color: "#00D2FF" }}
              onClick={() => {
                setEditOpen(true);
                setItemsDetails(_id);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setFormOpen(true);
                setItemsDetails({ _id });
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleAdd = () => {
    dispatch(
      AddItemHandler({ kind, quantity, companyName, price, notes })
    ).then((res) => {
      if (res.payload.status === 201) {
        setAddOpen(false);
        setRows([...rows, res.payload.data.item]);
      }
    });
  };

  const handleEdit = () => {
    dispatch(
      EditItemHandler({
        kind,
        quantity,
        companyName,
        price,
        notes,
        id: itemDetails,
      })
    ).then((res) => {
      if (res.payload.status === 201) {
        setEditOpen(false);
        setRows(
          rows.map((row) => {
            if (row._id === itemDetails) {
              return res.payload.data.item;
            } else {
              return row;
            }
          })
        );
      }
    });
  };

  const handleDelete = (_id) => {
    dispatch(DeleteItemHandler({ _id })).then((res) => {
      if (res.payload.status === 200) {
        setFormOpen(!formOpen);
        setRows(rows.filter((row) => row._id !== _id));
      }
    });
  };

  useEffect(() => {
    dispatch(GetInventoryHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setRows(res.payload.data.items);
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
          title={context.language === "en" ? "INVENTORY" : "المخزن"}
          subtitle={
            context.language === "en" ? "List Of Items" : "قائمه العناصر"
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
            {context.language === "en" ? "ADD ITEM" : "اضافه عنصر"}
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
        //     backgroundColor:
        //       theme.palette.mode === "dark"
        //         ? theme.palette.primary[500]
        //         : "#e0e0e0",
        //   },
        // }}
      >
        <DataGrid
          autoPageSize
          disableSelectionOnClick
          
          loading={loading}
          localeText={context.language === "en" ? null : arabicLocaleText}
          components={{ Toolbar: GridToolbar }}
          rows={rows.map((item, index) => ({
            id: index + 1,
            ...item,
          }))}
          columns={columns}
        />
      </Box>
      <Dialog
      dir={isArabic && 'rtl'}
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{isArabic ? "حذف هذا العنصر؟": "Delete this item?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {isArabic ? "هل انت متأكد بأنك تريد حذف هذا العنصر؟" : "Are you sure you want to delete this item?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(!formOpen)}>{isArabic ? "ألغاء" : "Cancel"}</Button>
          <Button
            onClick={() => handleDelete(itemDetails._id)}
            autoFocus
            color="error"
          >
            {isArabic ? "حذف" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        dir={context.language === "ar" && "rtl"}
        open={addOpen}
        onClose={() => setAddOpen(!addOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en" ? "Add Item!" : "أضافه عنصر!"}
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
            placeholder={context.language === "en" ? "Kind" : "النوع"}
            onChange={(e) => setKind(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Quantity" : "الكميه"}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            placeholder={
              context.language === "en" ? "Company Name" : "اسم الشركه"
            }
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Price" : "السعر"}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Notes" : "الملاحظات"}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(!addOpen)}>
            {context.language === "en" ? "Cancel" : "ألغاء"}
          </Button>
          <Button onClick={() => handleAdd()} autoFocus color="success">
            {context.language === "en" ? "Add" : "أضافه"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editOpen}
        dir={context.language === "ar" && "rtl"}
        onClose={() => setEditOpen(!editOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en" ? "Edit Item!" : "تعديل عنصر!"}
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
            placeholder={context.language === "en" ? "Kind" : "النوع"}
            onChange={(e) => setKind(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Quantity" : "الكميه"}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            placeholder={
              context.language === "en" ? "Company Name" : "اسم الشركه"
            }
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Price" : "السعر"}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            placeholder={context.language === "en" ? "Notes" : "الملاحظات"}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(!editOpen)}>
            {context.language === "en" ? "Cancel" : "ألغاء"}
          </Button>
          <Button onClick={() => handleEdit()} autoFocus color="success">
            {context.language === "ar" ? "تعديل" : "Edit"}
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

export default Inventory;
