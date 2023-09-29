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

const ResetStaff = () => {
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

  const handleResetAttendance = () => {
    dispatch(ResetAttendanceHandler({ _id: type })).then((res) => {
      if (res.payload.status === 200) {
        dispatch(GetStaffHandler()).then((res) => {
            window.location.pathname = "/attendance";
        });
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
          title={context.language === "en" ? "Reset Attendance" : "اعاده حضور موظف"}
          subtitle={
            context.language === "en" ? "List Of Attendance" : "قائمه الحضور"
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
          MenuProps={MenuProps}
          value={type}
          sx={{ width: "30%" }}
          defaultValue={0}
          onChange={(e) => {
            setIsTypeSelected(true);
            setType(e.target.value);
          }}
        >
          <MenuItem dir={context.language === "en" ? "ltr" : "rtl"} disabled value={0}>
            {context.language === "en" ? "Select an emoloyee" : "اختر موظف"}
          </MenuItem>
          {data &&
            data.map((staff) => (
              <MenuItem dir={context.language === "en" ? "ltr" : "rtl"} key={staff._id} value={staff._id}>
                {staff.name}
              </MenuItem>
            ))}
        </Select>
        <Button
          sx={{ display: type ? "block" : "none" }}
          onClick={() => handleResetAttendance()}
          variant="contained"
        >
          SUBMIT
        </Button>
      </Box>
    </Box>
  );
};

export default ResetStaff;
