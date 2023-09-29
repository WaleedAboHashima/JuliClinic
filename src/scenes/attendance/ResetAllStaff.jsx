import { Box, Button, IconButton, MenuItem, Select } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import resetLogo from "assets/reset.svg";
import { Formik } from "formik";
import { LanguageContext } from "language";
import { ArrowBack } from "@mui/icons-material";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { AddStaffHandler } from "apis/data/Staff/AddStaff";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import Header from "components/Header";
import { ResetAttendanceHandler } from "apis/data/Staff/ResetAttendance";
import { ResetAllAttendanceHandler } from "apis/data/Staff/ResetAllAttendance";

const ResetAllStaff = () => {
  const context = useContext(LanguageContext);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [type, setType] = useState(0);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();
  const day = startDate.getDate();
  const formattedDate = `${day}/${month}/${year}`;
  const dispatch = useDispatch();
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

  const handleResetAllAttendance = () => {
    dispatch(ResetAllAttendanceHandler({ type })).then((res) => {
      if (res.payload.status === 200) {
        window.location.pathname = "/attendance";
      }
    });
  };

  useEffect(() => {
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload.status === 200) {
        setData(res.payload.data.StaffList);
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
          title={
            context.language === "en"
              ? "Reset All Attendance"
              : "أعاده الحضور لتخصص"
          }
          subtitle={
            context.language === "en"
              ? "List Of Attendance of a staff"
              : "قائمه الحضور"
          }
        />
      </Box>
      <Box
        p={5}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        width={"100%"}
        gap={3}
      >
        <img
          style={{ width: 450, height: 450 }}
          src={resetLogo}
          alt="resetLogo"
        />
        <Select
          value={type}
          dir={context.language === "en" ? "ltr" : "rtl"}
          sx={
            context.language === "ar"
              ? {
                  width: "30%",
                  "& .MuiSvgIcon-root": {
                    left: "7px",
                    right: "auto",
                  },
                }
              : { width: "30%" }
          }
          defaultValue={0}
          onChange={(e) => {
            setIsTypeSelected(true);
            setType(e.target.value);
          }}
        >
          <MenuItem disabled dir={context.language === "ar" && "rtl"} value={0}>
            {context.language === "en" ? "Select a field" : "اختر المهنه"}
          </MenuItem>
          <MenuItem
            dir={context.language === "ar" && "rtl"}
            value={"assistant"}
          >
            {context.language === "en" ? "Assistant" : "مساعد"}
          </MenuItem>
          <MenuItem
            dir={context.language === "ar" && "rtl"}
            value={"call_center"}
          >
            {context.language === "en" ? "Call Center" : "مركز اتصال"}
          </MenuItem>
          <MenuItem
            dir={context.language === "ar" && "rtl"}
            value={"recipetion"}
          >
            {context.language === "en" ? "Receptionist" : "استقبال"}
          </MenuItem>
          <MenuItem dir={context.language === "ar" && "rtl"} value={"doctor"}>
            {context.language === "en" ? "Doctor" : "دكتور"}
          </MenuItem>
          <MenuItem dir={context.language === "ar" && "rtl"} value={"other"}>
            {context.language === "en" ? "Other" : "اخري"}
          </MenuItem>
        </Select>
        <Button
          sx={{ display: type ? "block" : "none" }}
          onClick={() => handleResetAllAttendance()}
          variant="contained"
        >
          SUBMIT
        </Button>
      </Box>
    </Box>
  );
};

export default ResetAllStaff;
