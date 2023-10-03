import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { GetOrderHandler } from "apis/Orders/GetOrder";
import { useTheme } from "@emotion/react";
import {
  ArrowOutwardOutlined,
  CloseOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EditOrderHandler } from "apis/Orders/EditOrder";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";

const Order = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [isEdit, setisEdit] = useState(false);
  const params = useParams();
  const [order, setOrder] = useState("");
  const theme = useTheme();
  const [additionalFields, setAdditionalFields] = useState([]);
  const [oldAdditionalFields, setOldAdditionalFields] = useState([]);
  const [selectedAssistance, setSelectedAssistance] = useState([]);
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
  const { id } = useParams();
  const [newDate, setNewDate] = useState();
  const [assistances, setAssistances] = useState([]);
  const [newTime, setNewTime] = useState();

  const handleAddFields = () => {
    const newField = { id: Date.now(), key: "", value: "" };
    setAdditionalFields([...additionalFields, newField]);
  };

  const handleKeyChange = (index, newKey) => {
    const updatedFields = [...oldAdditionalFields];
    updatedFields[index][newKey] =
      updatedFields[index][Object.keys(updatedFields[index])[0]];
    delete updatedFields[index][Object.keys(updatedFields[index])[0]];
    setOldAdditionalFields(updatedFields);
  };

  const handleValueChange = (index, newValue) => {
    const updatedFields = [...oldAdditionalFields];
    const currentKey = Object.keys(updatedFields[index])[0];
    updatedFields[index] = { [currentKey]: newValue };
    setOldAdditionalFields(updatedFields);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    const convertedObject = updatedFields.map(field => ({[field.key]: field.value}) )
    console.log(convertedObject)
    // setAdditionalFields(convertedObject);
  };

  const handleRemoveField = (id) => {
    const updatedFields = additionalFields.filter((field) => field.id !== id);
    setAdditionalFields(updatedFields);
  };

  const handleSubmit = () => {
    dispatch(
      EditOrderHandler({
        assistances: selectedAssistance,
        date: newDate,
        time: newTime,
        additionalInfo: oldAdditionalFields.concat(additionalFields),
        id,
      })
    ).then((res) => {
      if (res.payload.status === 200) {
        window.location.pathname = "/orders";
      }
    });
  };
  useEffect(() => {
    dispatch(GetOrderHandler({ _id: params.id })).then((res) => {
      if (res.payload.status === 200) {
        const date = dayjs(res.payload.data.order.date, "DD-MM-YYYY");
        const time = dayjs(res.payload.data.order.time, "HH:mm");
        setDate(date);
        setTime(time);
        setOrder(res.payload.data.order);
        setOldAdditionalFields(res.payload.data.order.addtionalInfo);
      }
    });
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload.status === 200) {
        setAssistances(
          res.payload.data.StaffList.filter(
            (staff) => staff.type === "ASSISTANT"
          )
        );
      }
    });
  }, [dispatch]);
  return (
    <Box m="1.5rem 2.5rem" display={"flex"} flexDirection={"column"} gap={5}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title={context.language === "en" ? "Order" : "الطلب"}
          subtitle={
            context.language === "en" ? "Order is below" : "الطلب معروض بالأسفل"
          }
        />
        <Box display={"flex"} gap={2}>
          <Button
            sx={{
              display: !isEdit && "none",
              backgroundColor: theme.palette.primary[500],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => setisEdit(false)}
          >
            {context.language === "en" ? "CANCEL" : "الغاء"}
            <CloseOutlined sx={{ mr: "10px" }} />
          </Button>
          <Button
            sx={{
              backgroundColor: theme.palette.primary[500],
              color: theme.palette.secondary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => (!isEdit ? setisEdit(true) : handleSubmit())}
          >
            {!isEdit
              ? context.language === "en"
                ? "EDIT ORDER"
                : "تعديل الطلب"
              : context.language === "en"
              ? "Submit"
              : "استمرار"}
            {!isEdit ? (
              <EditOutlined sx={{ mr: "10px" }} />
            ) : (
              <ArrowOutwardOutlined />
            )}
          </Button>
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"column"}>
        <Header
          title={context.language === "en" ? "Information" : "المعلومات"}
        />
        <Box
          sx={{
            background: "tranparent",
            border: `1px solid ${theme.palette.primary[200]}`,
            display: "flex",
            flexDirection: "column",
            p: 4,
            gap: 3,
          }}
        >
          <Typography>
            Name:{" "}
            {order.client &&
              `${order.client.full_name}`}
          </Typography>
          <Typography>Code: {order.client && order.client.code}</Typography>
          <Typography>Phone: {order.client && order.client.phone}</Typography>
          <Typography>
            Doctor Name: {order.doctor && `${order.doctor.name}`}
          </Typography>
          <Typography>
            Service Name: {order.service && order.service.name}
          </Typography>
          <Typography>
            Service Price: {order.service && order.service.price}
          </Typography>
          <Header title={"Assistances"} />
          <Select
            disabled={isEdit ? false : true}
            multiple
            value={selectedAssistance}
            onChange={(e) => setSelectedAssistance(e.target.value)}
          >
            {assistances &&
              assistances.map((assistance) => (
                <MenuItem key={assistance._id} value={assistance.name}>
                  {assistance.name}
                </MenuItem>
              ))}
          </Select>
          <Header title={"Additional Info"} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disabled={isEdit ? false : true}
              format="DD/MM/YYYY"
              defaultValue={dayjs(new Date())}
              value={date}
              onChange={(value) => {
                setNewDate(value);
              }}
            />
            <TimePicker
              disabled={isEdit ? false : true}
              format="HH:mm"
              defaultValue={dayjs(new Date())}
              value={time}
              onChange={(value) => {
                setNewTime(value);
              }}
            />
          </LocalizationProvider>
          {oldAdditionalFields &&
            oldAdditionalFields.map((additionalInfo, index) => {
              const keyValuePairs = Object.entries(additionalInfo);
              const result = keyValuePairs.map(([key, value]) =>
                !isEdit ? (
                  <Typography key={key}>
                    {key} : {value}
                  </Typography>
                ) : (
                  <Box display="flex" gap={2} key={key}>
                    <TextField
                      onChange={(e) => handleKeyChange(index, e.target.value)}
                      value={Object.keys(additionalInfo)[0]} // Display the current key
                    />
                    <TextField
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      value={Object.values(additionalInfo)[0]} // Display the current value
                    />
                  </Box>
                )
              );
              return result;
            })}
          {isEdit && (
            <Box mt={2}>
              <Header title={"Extra Additional Info"} />
              {additionalFields.map((field, index) => (
                <Box key={index} display="flex" gap={2} my={2}>
                  <TextField
                    placeholder="Name"
                    value={field.key}
                    onChange={(e) =>
                      handleFieldChange(index, "key", e.target.value)
                    }
                  />
                  <TextField
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(index, "value", e.target.value)
                    }
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveField(field.id)}
                  >
                    X
                  </Button>
                </Box>
              ))}
              <Button variant="contained" onClick={handleAddFields}>
                Add Fields
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Order;
