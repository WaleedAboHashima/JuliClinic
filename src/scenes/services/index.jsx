import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";
import Header from "components/Header";
import { useDispatch, useSelector } from "react-redux";
import { GetServicesHandler } from "apis/Services/GetServices";
import { LanguageContext } from "language";
import { DeleteServicesHandler } from "apis/Services/DeleteServices";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "universal-cookie";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { EditServiceHandler } from "apis/Services/EditServices";

const Service = ({
  _id,
  name,
  price,
  doctors,
  handleDelete,
  setEditOpen,
  setServiceId,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(LanguageContext);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "لاسم",
      flex: 2,
    },
    {
      field: "salary",
      headerName:
        context.language === "en" ? "Salary / Percentage" : "النسبه / المرتب",
      flex: 2,
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
  ];
  const deleteHandler = () => {
    setLoading(true);
    handleDelete(_id);
  };
  return (
    <Box key={_id}>
      <Card
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography
            sx={{ mb: "1.5rem" }}
            color={theme.palette.secondary[400]}
          >
            ${Number(price).toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded
              ? context.language === "en"
                ? "See Less"
                : "اخفاء التفاصيل"
              : context.language === "en"
              ? "See More"
              : "اظهار التفاصيل"}
          </Button>
        </CardActions>
        <Collapse
          in={isExpanded}
          timeout="auto"
          unmountOnExit
          sx={{
            color: theme.palette.primary[300],
          }}
        >
          <CardContent>
            <Typography color={theme.palette.secondary[400]}>
              {context.language === "en" ? "Doctors:" : "الدكاتره:"}
            </Typography>
            <DataGrid
              autoPageSize
              sx={{ height: "300px" }}
              rows={doctors.map((doctor, index) => ({
                id: index + 1,
                ...doctor,
              }))}
              columns={columns}
            />
          </CardContent>
          <Box
            sx={{
              m: 2,
              display: "flex",
              gap: 2,
              justifyContent: "right",
            }}
          >
            <Button
              onClick={() => {
                setServiceId(_id);
                setEditOpen(true);
              }}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary[300],
                color: "white",
              }}
            >
              {context.language === "en" ? "EDIT" : "تعديل"}
            </Button>
            <Button
              onClick={() => deleteHandler(_id)}
              variant="contained"
              color="error"
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} size={20} />
              ) : context.language === "en" ? (
                "DELETE"
              ) : (
                "حذف"
              )}
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

const Services = () => {
  const [data, setData] = useState();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const context = useContext(LanguageContext);
  const theme = useTheme();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState([""]);
  const [editOpen, setEditOpen] = useState(false);
  const navigator = useNavigate();
  const [serviceId, setServiceId] = useState();
  const [doctors, setDoctors] = useState([]);
  const cookies = new Cookies();
  const isArabic = context.language === "ar";
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleAddFields = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    setAdditionalFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...additionalFields];
    updatedFields.splice(index, 1);
    setAdditionalFields(updatedFields);
  };

  const handleEdit = () => {
    const additionalInfo = additionalFields.map((field) => {
      const keys = field.key.split(",");
      const values = field.value.split(",");
      const info = {};
      keys.forEach((key, index) => {
        info[key] = values[index];
      });

      return info;
    });
    dispatch(
      EditServiceHandler({
        id: serviceId,
        name,
        doctors: selectedDoctor,
        price,
        additionalInfo,
      })
    ).then((res) => {
      if (res.payload.status === 201) {
        setEditOpen(false);
        dispatch(GetServicesHandler()).then((res) => {
          if (res.payload) {
            if (res.payload.status === 200) {
              setData(res.payload.data.services);
            }
          }
        });
      }
    });
  };

  const handleDelete = (_id) => {
    dispatch(DeleteServicesHandler({ _id })).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          dispatch(GetServicesHandler()).then((res) => {
            setData(res.payload.data.services);
          });
        }
      }
    });
  };

  useEffect(() => {
    dispatch(GetServicesHandler()).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          setData(res.payload.data.services);
        }
      }
    });
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload.status === 200) {
        const doctors = res.payload.data.StaffList.filter(
          (client) => client.type === "DOCTOR"
        );

        setDoctors(doctors);
      }
    });
  }, [dispatch]);
  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={{ xs: 5, sm: 0 }}
      >
        <Header
          title={context.language === "en" ? "SERVICES" : "خدمات"}
          subtitle={
            context.language === "en"
              ? "See your list of services."
              : "كل الخدمات"
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
            onClick={() => navigator("/addservice")}
          >
            {context.language === "en" ? "ADD Service" : "اضافه خدمه"}
            <AddOutlined sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      {data ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-evenly"
          rowGap="20px"
          columnGap="1.33%"
          height={"100vh"}
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(({ _id, name, price, doctors }) => (
            <Service
              key={_id}
              _id={_id}
              name={name}
              price={price}
              doctors={doctors}
              setEditOpen={setEditOpen}
              handleDelete={handleDelete}
              setServiceId={setServiceId}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
      <Dialog
        dir={context.language === "ar" && "rtl"}
        open={editOpen}
        onClose={() => setEditOpen(!editOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.language === "en" ? "Edit" : "تعديل"}
          {/* <span style={{ color: theme.palette.primary[400] }}>
            {`${serviceDetails.firstName} ${serviceDetails.middleName} ${serviceDetails.lastName}`}
            ?
          </span> */}
        </DialogTitle>
        <DialogContent>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            flexDirection={"column"}
          >
            <Select
              fullWidth
              defaultValue={[""]}
              value={selectedDoctor}
              onChange={(e) => {
                const selectedValues = e.target.value;
                // Filter out the empty string from selected values
                const updatedSelectedValues = selectedValues.filter(
                  (value) => value !== ""
                );
                setSelectedDoctor(updatedSelectedValues);
              }}
              multiple
            >
              <MenuItem
                dir={context.language === "ar" && "rtl"}
                value={[""]}
                disabled
              >
                {context.language === "en" ? "Select a doctor" : "اختر الطبيب"}
              </MenuItem>
              {doctors.length > 0 &&
                doctors.map((doctor) => (
                  <MenuItem
                    dir={context.language === "ar" && "rtl"}
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.name}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              fullWidth
              placeholder={context.language === "en" ? "Name" : "اسم"}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder={context.language === "en" ? "Price" : "السعر"}
              onChange={(e) => setPrice(e.target.value)}
            />
            {additionalFields.map((field, index) => (
              <Box key={index} display="flex" gap={2} my={2}>
                <TextField
                  placeholder={isArabic ? "الاسم" : "Name"}
                  value={field.key}
                  onChange={(e) =>
                    handleFieldChange(index, "key", e.target.value)
                  }
                />
                <TextField
                  placeholder={isArabic ? "القيمه" : "Value"}
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(index, "value", e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveField(index)}
                >
                  X
                </Button>
              </Box>
            ))}
            <Button variant="contained" onClick={handleAddFields}>
              {isArabic ? "اضافه خانه" : "Add Info"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(!editOpen)}>
            {" "}
            {context.language === "en" ? "Cancel" : "ألغاء"}
          </Button>
          <Button onClick={() => handleEdit()} autoFocus color="success">
            {context.language === "en" ? "Submit" : "أستمرار"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
