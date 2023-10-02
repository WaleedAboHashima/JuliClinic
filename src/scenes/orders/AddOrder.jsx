import { Box, Button, CircularProgress, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useEffect, useState } from "react";
import OrdersLogo from "assets/orders.svg";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { GetServicesHandler } from "apis/Services/GetServices";
import { currencies } from "constant";
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
const AddOrder = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [assistances, setAssistances] = useState([]);
  const [services, setServices] = useState([]);
  const state = useSelector(state => state.AddOrder)
  const [selectedServices, setSelectedServices] = useState(1);
  const [currency, setCurrency] = useState("EGP");
  const [selectedDoctor, setSelectedDoctor] = useState(1);
  const isArabic = context.language === "ar";
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
  const [additionalFields, setAdditionalFields] = useState([]);
  const [clients, setClients] = useState([]);
  const theme = useTheme();
  const [selectedClient, setSelectedClient] = useState(1);
  const [amountPaid, setAmoundPaid] = useState();
  const [selectedAssistances, setSelectedAssistances] = useState([""]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddSubmit = () => {
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
    const newTime = `${hour}:${minute}`
    const formatted = `${day}-${month}-${year}`;
    dispatch(
      AddOrdersHandler({
        selectedServices,
        client_id: selectedClient,
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

  const handleRemoveField = (index) => {
    const updatedFields = [...additionalFields];
    updatedFields.splice(index, 1);
    setAdditionalFields(updatedFields);
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
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title={context.language === "en" ? "Add Appointments" : "اضافه مواعيد"}
          subtitle={
            context.language === "en" ? "Add Appointments below" : "اضافه مواعيد"
          }
        />
      </Box>
      <Box display={"flex"} alignItems={"center"} height={"100vh"} gap={20}>
        <img
          style={{ width: 450, height: 450, display: isMobile && "none" }}
          src={OrdersLogo}
          alt="orderLogo"
        />
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          overflow={"scroll"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSubmit();
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
            <Header title={isArabic ? "المعلومات" : "Information"} />
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
              value={selectedClient}
              defaultValue={1}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <MenuItem value={1} disabled>
                {isArabic ? "اختر العميل" : "Select a client"}
              </MenuItem>
              {clients.length &&
                clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {`${client.full_name}`}
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
                  console.log(value)
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
              fullWidth
              type="submit"
              disabled={
                selectedDoctor &&
                selectedAssistances &&
                currency &&
                date &&
                time &&
                selectedServices &&
                selectedClient &&
                amountPaid
                  ? false
                  : true
              }
              variant="contained"
            >
              {state.loading ? <CircularProgress size={20} sx={{color: 'white'}} /> : context.language === "en" ? "Submit" : "أستمرار"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default AddOrder;
