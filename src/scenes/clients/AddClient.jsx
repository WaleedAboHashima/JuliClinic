import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useState } from "react";
import UserLogo from "assets/addclients.svg";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AddClientHandler } from "apis/data/Clients/AddClient";
import { countries } from "constant";

const AddClient = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState();
  const [middleName, setMiddleName] = useState();
  const [lastName, setLastName] = useState();
  const [phone, setPhone] = useState();
  const [country, setCountry] = useState("none");
  const state = useSelector((state) => state.AddClient);
  const [error, setError] = useState("");

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


  //Function

  const handleAddUser = () => {
    setError("");
    dispatch(
      AddClientHandler({ firstName, middleName, lastName, phone, country })
    ).then((res) => {
      if (res.payload.status === 201) {
        window.location.pathname = "/clients";
      } else {
        setError(
          context.language === "en"
            ? res.payload.message
            : "يوجد عميل بهذه البيانات"
        );
      }
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title={context.language === "en" ? "Add Clients" : "اضافه عملاء"}
          subtitle={
            context.language === "en"
              ? "Add Clients Below"
              : "اضافه عملاء بالأسفل"
          }
        />
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        height={"100vh"}
      >
        <img
          style={{ width: 450, height: 450 }}
          src={UserLogo}
          alt="usersLogo"
        />
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Formik
            onSubmit={() => handleAddUser()}
            initialValues={{
              firstName: "",
              middleName: "",
              lastName: "",
              phone: "",
              country: "",
            }}
          >
            {({ handleChange, handleSubmit, values }) => (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  width: "40%",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onChangeCapture={(e) => setFirstName(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "First Name" : "الاسم"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="middleName"
                  value={values.middleName}
                  onChange={handleChange}
                  onChangeCapture={(e) => setMiddleName(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Middle Name" : "الاسم الاوسط"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onChangeCapture={(e) => setLastName(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Last Name" : "اسم العائله"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onChangeCapture={(e) => setPhone(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Phone" : "رقم الهاتف"
                  }
                />
                {/* <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onChangeCapture={(e) => setCountry(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Country" : "المدينه"
                  }
                /> */}
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
                    {context.language === "en"
                      ? "Select a country"
                      : "اختر مدينه"}
                  </MenuItem>
                  {countries.map((country) => 
                  <MenuItem dir={context.language==="en" ? "ltr" : "rtl"} value={country.shortcut}>
                  {context.language === "en" ? country.name : country.arabicName}
                  </MenuItem>
                  )}
                </Select>
                <Button
                  disabled={
                    firstName && lastName && middleName && country && phone
                      ? false
                      : true
                  }
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                  type="submit"
                  variant={"contained"}
                  sx={{ width: "30%" }}
                >
                  {state.loading ? (
                    <CircularProgress size={25} sx={{ color: "#FFE3A3" }} />
                  ) : context.language === "en" ? (
                    "Submit"
                  ) : (
                    "استمرار"
                  )}
                </Button>
                <Typography fontWeight={"bold"} fontSize={20}>
                  {error}
                </Typography>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default AddClient;
