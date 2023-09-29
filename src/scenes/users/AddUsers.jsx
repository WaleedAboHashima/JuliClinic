import {
  Box,
  MenuItem,
  Select,
  TextField,
  Button,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useEffect, useState } from "react";
import UserLogo from "assets/addusers.svg";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { GetServicesHandler } from "apis/Services/GetServices";
import { motion } from "framer-motion";
import { AddUsersHandler } from "apis/data/Users/AddUsers";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const AddUser = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const state = useSelector((state) => state.AddUsers);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  //Function

  const handleAddUser = () => {
    setError("");
    dispatch(AddUsersHandler({ username, password, email })).then((res) => {
      if (res.payload.status === 201) {
        window.location.pathname = "/users";
      } else {
        setError(
          context.language === "en"
            ? res.payload.message
            : "يوجد مستخدم بهذه البيانات"
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
          title={context.language === "en" ? "Add Users" : "اضافه مستخدمون"}
          subtitle={
            context.language === "en"
              ? "Add Users Below"
              : "اضافه مستخدمون بالأسفل"
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
            initialValues={{ username: "", password: "", email: "" }}
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
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onChangeCapture={(e) => setUsername(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Username" : "اسم المستخدم"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onChangeCapture={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Email" : "البريد الالكتروني"
                  }
                />
                <TextField
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  name="password"
                  type={!visible ? "password" : "text"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setVisible(!visible)}
                        >
                          {visible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={values.password}
                  onChange={handleChange}
                  onChangeCapture={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Password" : "كلمه المرور"
                  }
                />
                <Button
                  disabled={username && password && email ? false : true}
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

export default AddUser;
