import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Link,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useEffect, useState } from "react";
import OrdersLogo from "assets/orders.svg";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { GetServicesHandler } from "apis/Services/GetServices";
import { countries, currencies } from "constant";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AddOrdersHandler } from "apis/Orders/AddOrders";
import { GetClientsHandler } from "apis/data/Clients/GetClients";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import { SearchClientHandler } from "apis/data/Clients/SearchClients";
import { AddClientHandler } from "apis/data/Clients/AddClient";
const AddOrder = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [assistances, setAssistances] = useState([]);
  const [services, setServices] = useState([]);
  const state = useSelector((state) => state.AddOrder);
  const addState = useSelector((state) => state.AddClient);
  const [selectedServices, setSelectedServices] = useState(1);
  const [currency, setCurrency] = useState("EGP");
  const [selectedDoctor, setSelectedDoctor] = useState(1);
  const isArabic = context.language === "ar";
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
  const [additionalFields, setAdditionalFields] = useState([]);
  const [clients, setClients] = useState([]);
  const theme = useTheme();
  const [amountPaid, setAmoundPaid] = useState();
  const [selectedAssistances, setSelectedAssistances] = useState([""]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackOpen, setSnackOpen] = useState(false);
  const [error, setError] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [code, setCode] = useState();
  const [results, setResults] = useState([]);
  const searchState = useSelector((state) => state.SearchClient);
  const [isOldClient, setIsOldClient] = useState(0);
  const minDate = dayjs().startOf("day");
  //client
  const [fullName, setFullName] = useState();
  const [phone, setPhone] = useState();
  const [selectedCountry, setSelectedCountry] = useState("none");

  //Menu
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

  const handleAddClient = () => {
    dispatch(
      AddClientHandler({ phone, fullName, country: selectedCountry })
    ).then((res) => {
      if (res.payload.status === 201) {
        handleAddSubmit(res.payload.data.client._id);
      }
    });
  };
  const handleAddSubmit = (_id) => {
    const additionalInfo = additionalFields.map((field) => {
      const keys = field.key.split(",");
      const values = field.value.split(",");
      const info = {};
      keys.forEach((key, index) => {
        info[key] = values[index];
      });

      return info;
    });
    const day = date.$D;
    const year = date.$y;
    const month = date.$M + 1;
    const hour = time.$H;
    const minute = time.$m;
    const newTime = `${hour}:${minute}`;
    const formatted = `${day}-${month}-${year}`;
    dispatch(
      AddOrdersHandler({
        selectedServices,
        client_id: _id ? _id : selectedClient,
        amountPaid,
        currency,
        selectedAssistances,
        date: formatted,
        time: newTime,
        selectedDoctor,
        additionalInfo,
      })
    ).then((res) => {
      if (res.payload.status === 201) {
        window.location.pathname = "/orders";
      } else if (res.payload.status === 409) {
        setError(
          isArabic
            ? "يوجد طلب بهذا التوقيت"
            : "There is an order with this date"
        );
        setSuggestions(res.payload.data);
        setSnackOpen(true);
      } else {
        setError(res.payload.error.message);
        setSnackOpen(true);
      }
    });
  };

  const handleAddFields = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    setAdditionalFields(updatedFields);
  };

  const handlesearch = () => {
    dispatch(SearchClientHandler({ code })).then((res) => {
      if (res.payload.status === 200) {
        setResults(res.payload.data.client);
      }
    });
  };
  const handleRemoveField = (index) => {
    const updatedFields = [...additionalFields];
    updatedFields.splice(index, 1);
    setAdditionalFields(updatedFields);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  useEffect(() => {
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload.status === 200) {
        const assistances = res.payload.data.StaffList.filter(
          (staff) => staff.type === "ASSISTANT"
        );
        const doctors = res.payload.data.StaffList.filter(
          (staff) => staff.type === "DOCTOR"
        );
        setDoctors(doctors);
        setAssistances(assistances);
      }
      dispatch(GetServicesHandler()).then((res) => {
        if (res.payload.status === 200) {
          setServices(res.payload.data.services);
        }
      });
      dispatch(GetClientsHandler()).then((res) => {
        if (res.payload.status === 200) {
          setClients(res.payload.data.clients);
        }
      });
    });
  }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem" display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={5}
      >
        <Header
          title={
            context.language === "en" ? "Add Appointments" : "اضافه مواعيد"
          }
          subtitle={
            context.language === "en"
              ? "Add Appointments below"
              : "اضافه مواعيد"
          }
        />
      </Box>
      {selectedClient.length ? (
        <Box>
          <Box display={isOldClient ? "none" : "flex"} flexDirection={"column"}>
            <Header title={!isArabic ? "Client Info" : "بيانات المستخدم"} />
            <Box width={"100%"} display={"flex"}>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "First Name" : "الاسم"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Phone" : "رقم الهاتف"
                  }
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
                      value={governement.governorate}
                      key={governement.governorate}
                    >
                      {governement.governorate}
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
                    {context.language === "en"
                      ? "Select a country"
                      : "اختر مدينه"}
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
                <Typography fontWeight={"bold"} fontSize={20}>
                  {error}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Header title={isArabic ? "المعلومات" : "Information"} />
            <Box display={"flex"} alignItems={"center"}>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                overflow={"scroll"}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    isOldClient ? handleAddSubmit() : handleAddClient();
                  }}
                  style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <Select
                    fullWidth
                    placeholder=""
                    value={selectedServices}
                    defaultValue={1}
                    onChange={(e) => setSelectedServices(e.target.value)}
                  >
                    <MenuItem value={1} disabled>
                      {isArabic ? "اختر الخدمه" : "Select a service"}
                    </MenuItem>
                    {services.length &&
                      services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <Select
                    fullWidth
                    placeholder=""
                    value={selectedDoctor}
                    defaultValue={1}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  >
                    <MenuItem value={1} disabled>
                      {isArabic ? "اختر الطبيب" : "Select a doctor"}
                    </MenuItem>
                    {doctors.length &&
                      doctors.map((doctor) => (
                        <MenuItem key={doctor._id} value={doctor._id}>
                          {doctor.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <Select
                    value={selectedAssistances}
                    fullWidth
                    onChange={(e) => {
                      const selectedValues = e.target.value;
                      // Filter out the empty string from selected values
                      const updatedSelectedValues = selectedValues.filter(
                        (value) => value !== ""
                      );
                      setSelectedAssistances(updatedSelectedValues);
                    }}
                    multiple
                  >
                    <MenuItem disabled value="">
                      {isArabic ? "اختر المساعدين" : "Select an assistant"}
                    </MenuItem>
                    {assistances.length &&
                      assistances.map((assistant) => (
                        <MenuItem value={assistant._id} key={assistant._id}>
                          {assistant.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <TextField
                    fullWidth
                    placeholder={isArabic ? "القيمه المدفوعه" : "Amount Paid"}
                    onChange={(e) => setAmoundPaid(e.target.value)}
                  />
                  <Select
                    fullWidth
                    onChange={(e) => setCurrency(e.target.value)}
                    defaultValue={"EGP"}
                    value={currency}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.name} value={currency.code}>
                        {currency.code}
                      </MenuItem>
                    ))}
                  </Select>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      defaultValue={dayjs(new Date())}
                      value={date.format("DD-MM-YYYY")}
                      minDate={minDate}
                      onChange={(value) => {
                        setDate(value);
                      }}
                    />
                    <TimePicker
                      sx={{ width: "100%" }}
                      format="HH:mm"
                      defaultValue={dayjs(new Date())}
                      value={time}
                      onChange={(value) => {
                        setTime(value);
                        console.log(value);
                      }}
                    />
                  </LocalizationProvider>
                  <Header
                    title={
                      isArabic
                        ? "معلومات اخري (اختياري)"
                        : "Additional Info (Optional)"
                    }
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
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "40%" }}
                  >
                    {state.loading || addState.loading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : context.language === "en" ? (
                      "Submit"
                    ) : (
                      "أستمرار"
                    )}
                  </Button>
                </form>
              </Box>
            </Box>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={snackOpen}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={snackOpen}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {suggestions.map((suggestion, index) => (
                <Box key={index}>
                  {isArabic
                    ? `التاريخ ${suggestion.substring(
                        0,
                        10
                      )} الوقت : ${suggestion.substring(11, 20)}`
                    : `Date : ${suggestion.substring(
                        0,
                        10
                      )} Time: ${suggestion.substring(11, 20)}`}
                </Box>
              ))}
            </Alert>
          </Snackbar>
        </Box>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          width={"100%"}
          alignItems={"center"}
          gap={2}
        >
          <img
            style={{ width: 450, height: 450, display: isMobile && "none" }}
            src={OrdersLogo}
            alt="orderLogo"
          />
          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
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
            <IconButton onClick={() => handlesearch()} type="submit">
              <Search />
            </IconButton>
          </Box>

          {searchState.loading ? (
            <CircularProgress color="primary" size={20} />
          ) : results.length ? (
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedClient(results[0]._id);
                setIsOldClient(1);
              }}
            >
              {results[0].full_name}
            </Link>
          ) : (
            ""
          )}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedClient([{ name: "" }]);
            }}
          >
            {isArabic ? "عميل جديد؟" : "New Client?"}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AddOrder;
