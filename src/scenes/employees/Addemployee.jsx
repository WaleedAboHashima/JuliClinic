import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import fieldLogo from "assets/medicine.svg";
import doctorLogo from "assets/doctor.svg";
import assistantLogo from "assets/assistant.svg";
import contactus from "assets/contact us.svg";
import recipetionLogo from "assets/recipetion.svg";
import otherLogo from "assets/other.svg";
import { Formik } from "formik";
import { LanguageContext } from "language";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { AddStaffHandler } from "apis/data/Staff/AddStaff";
const InputText = ({
  values,
  name,
  handleBlur,
  handleChange,
  setChange,
  label,
  way,
}) => {
  return (
    <TextField
    type={label === "Password" || label === "كلمه المرور" ? "password" : "text"}
      fullWidth
      value={
        label === "Name" || label === "الأسم"
          ? values.name
          : label === "Salary" || label === "المرتب"
          ? values.salary
          : label === "Password" || label === "كلمه المرور"
          ? values.password
          : label === "Email" || label === "البريد الإلكتروني"
          ? values.email
          : ""
      }
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      onChangeCapture={(e) => setChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {label === "Salary"
              ? way === "fixed"
                ? label
                : "Percentage %"
              : label}
          </InputAdornment>
        ),
      }}
    />
  );
};

const AddEmployee = () => {
  const context = useContext(LanguageContext);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [salary, setSalary] = useState(undefined);
  const [percentage, setPercentage] = useState();
  const [way, setWay] = useState("fixed");
  const [startDate, setStartDate] = useState(new Date());
  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();
  const day = startDate.getDate();
  const formattedDate = `${day}/${month}/${year}`;
  const dispatch = useDispatch();
  const inputsData =
    type === "doctor" || type === "assistant"
      ? [
          {
            name: "name",
            text: "Name",
            ar: "الأسم",
          },
          {
            name: "salary",
            text: "Salary",
            ar: "المرتب",
          },
        ]
      : type === "call_center" || type === "recipetion"
      ? [
          {
            name: "name",
            text: "Name",
            ar: "الأسم",
          },
          {
            name: "email",
            text: "Email",
            ar: "البريد الإلكتروني",
          },
          { name: "pwd", text: "Password", ar: "كلمه المرور" },
          {
            name: "salary",
            text: "Salary",
            ar: "المرتب",
          },
        ]
      : [
          {
            name: "name",
            text: "Name",
            ar: "الأسم",
          },
          {
            name: "salary",
            text: "Salary",
            ar: "المرتب",
          },
        ];
  const submitHandler = () => {
    dispatch(
      AddStaffHandler({
        name,
        salary: salary && parseInt(salary),
        percentage: percentage && parseInt(percentage),
        way,
        type,
        email: email && email,
        pwd: pwd && pwd,
      })
    ).then((res) => {
      if (res.payload.status === 201 || res.payload.status === 200) {
        window.location.pathname = "/employees";
      }
    });
  };

  return (
    <Box display={"flex"} height={"100%"} width={"100%"}>
      <Box
        p={5}
        display={"flex"}
        alignItems={!isTypeSelected && "center"}
        flexDirection={"column"}
        width={"100%"}
      >
        {!isTypeSelected ? (
          <>
            <img
              style={{ width: 450, height: 450 }}
              src={fieldLogo}
              alt="cliniclogo"
            />
            <Select
              dir={context.language === "en" ? "ltr" : "rtl"}
              sx={
                context.language === "ar"
                  ? {
                      width: {xs: "100%" , md: "30%"},
                      "& .MuiSvgIcon-root": {
                        left: "7px",
                        right: "auto",
                      },
                    }
                  : { width: {xs: "100%" , md: "30%"}}
              }
              defaultValue={0}
              onChange={(e) => {
                setIsTypeSelected(true);
                setType(e.target.value);
              }}
            >
              <MenuItem dir={context.language === "ar" && "rtl"} value={0}>
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
              <MenuItem
                dir={context.language === "ar" && "rtl"}
                value={"doctor"}
              >
                {context.language === "en" ? "Doctor" : "دكتور"}
              </MenuItem>
              <MenuItem
                dir={context.language === "ar" && "rtl"}
                value={"other"}
              >
                {context.language === "en" ? "Other" : "اخري"}
              </MenuItem>
            </Select>
          </>
        ) : type === "doctor" ? (
          <>
            <Box>
              <IconButton onClick={() => setIsTypeSelected("")}>
                <ArrowBack />
              </IconButton>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <img
                style={{ width: 400, height: 400 }}
                src={doctorLogo}
                alt="doclogo"
              />
              <Formik
                initialValues={initialState}
                validationSchema={validateSchema}
                onSubmit={() => submitHandler()}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  handleChange,
                  errors,
                  values,
                  touched,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 10,
                      width: "70%",
                    }}
                  >
                    <Select
                      name="way"
                      value={way}
                      onChange={(e) => setWay(e.target.value)}
                      fullWidth
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      sx={
                        context.language === "ar" && {
                          "& .MuiSvgIcon-root": {
                            left: "7px",
                            right: "auto",
                          },
                        }
                      }
                    >
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={way}
                        disabled
                      >
                        {context.language === "en"
                          ? "Select Way"
                          : "اختر طريقه"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"fixed"}
                      >
                        {context.language === "en" ? "Fixed" : "مرتب ثابت"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"com"}
                      >
                        {context.language === "en" ? "Commision" : "عموله"}
                      </MenuItem>
                    </Select>
                    {inputsData.map((input) => (
                      <InputText
                        key={context.language === "en" ? input.name : input.ar}
                        values={values}
                        name={context.language === "en" ? input.name : input.ar}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        way={way}
                        setChange={
                          input.name === "name"
                            ? setName
                            : input.name === "salary"
                            ? way === "fixed"
                              ? setSalary
                              : setPercentage
                            : setWay
                        }
                        label={
                          context.language === "en" ? input.text : input.ar
                        }
                      />
                    ))}

                    <Button type="submit" variant="contained">
                      {context.language === "en" ? "Submit" : "استمرار"}
                    </Button>
                  </form>
                )}
              </Formik>
            </Box>
          </>
        ) : type === "call_center" ? (
          <>
            <Box>
              <IconButton onClick={() => setIsTypeSelected("")}>
                {context.language === "en" ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <img
                style={{ width: 400, height: 400 }}
                src={contactus}
                alt="contactuslogo"
              />
              <Formik
                initialValues={initialState}
                validationSchema={validateSchema}
                onSubmit={() => submitHandler()}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  handleChange,
                  errors,
                  values,
                  touched,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 10,
                      width: "70%",
                    }}
                  >
                    <Select
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      sx={
                        context.language === "ar" && {
                          "& .MuiSvgIcon-root": {
                            left: "7px",
                            right: "auto",
                          },
                        }
                      }
                      name="way"
                      value={way}
                      onChange={(e) => setWay(e.target.value)}
                      fullWidth
                    >
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={way}
                        disabled
                      >
                        {context.language === "en"
                          ? "Select Way"
                          : "اختر طريقه"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"fixed"}
                      >
                        {context.language === "en" ? "Fixed" : "ثابت"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"com"}
                      >
                        {context.language === "en" ? "Commision" : "عموله"}
                      </MenuItem>
                    </Select>
                    {inputsData.map((input) => (
                      <InputText
                        key={input.name}
                        values={values}
                        name={input.name}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        way={way}
                        setChange={
                          input.name === "name"
                            ? setName
                            : input.name === "salary"
                            ? way === "fixed"
                              ? setSalary
                              : setPercentage
                            : input.name === "pwd"
                            ? setPwd
                            : input.name === "email"
                            ? setEmail
                            : setWay
                        }
                        label={
                          context.language === "en" ? input.text : input.ar
                        }
                      />
                    ))}

                    <Button type="submit" variant="contained">
                      {context.language === "en" ? "Submit" : "أستمرار"}
                    </Button>
                  </form>
                )}
              </Formik>
            </Box>
          </>
        ) : type === "assistant" ? (
          <>
            <Box>
              <IconButton onClick={() => setIsTypeSelected("")}>
                {context.language === "en" ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <img
                style={{ width: 400, height: 400 }}
                src={assistantLogo}
                alt="assistantLogo"
              />
              <Formik
                initialValues={initialState}
                validationSchema={validateSchema}
                onSubmit={() => submitHandler()}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  handleChange,
                  errors,
                  values,
                  touched,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 10,
                      width: "70%",
                    }}
                  >
                    <Select
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      sx={
                        context.language === "ar" && {
                          "& .MuiSvgIcon-root": {
                            left: "7px",
                            right: "auto",
                          },
                        }
                      }
                      name="way"
                      value={way}
                      onChange={(e) => setWay(e.target.value)}
                      fullWidth
                    >
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={way}
                        disabled
                      >
                        {context.language === "en"
                          ? "Select Way"
                          : "اختر طريقه"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"fixed"}
                      >
                        {context.language === "en" ? "Fixed" : "ثابت"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"com"}
                      >
                        {context.language === "en" ? "Commision" : "عموله"}
                      </MenuItem>
                    </Select>
                    {inputsData.map((input) => (
                      <InputText
                        key={input.name}
                        values={values}
                        name={input.name}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        way={way}
                        setChange={
                          input.name === "name"
                            ? setName
                            : input.name === "salary"
                            ? way === "fixed"
                              ? setSalary
                              : setPercentage
                            : input.name === "pwd"
                            ? setPwd
                            : input.name === "email"
                            ? setEmail
                            : setWay
                        }
                        label={
                          context.language === "en" ? input.text : input.ar
                        }
                      />
                    ))}

                    <Button type="submit" variant="contained">
                      {context.language === "en" ? "Submit" : "استمرار"}
                    </Button>
                  </form>
                )}
              </Formik>
            </Box>
          </>
        ) : type === "recipetion" ? (
          <>
            <Box>
              <IconButton onClick={() => setIsTypeSelected("")}>
                {context.language === "en" ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <img
                style={{ width: 400, height: 400 }}
                src={recipetionLogo}
                alt="recipetionLogo"
              />
              <Formik
                initialValues={initialState}
                validationSchema={validateSchema}
                onSubmit={() => submitHandler()}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  handleChange,
                  errors,
                  values,
                  touched,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 10,
                      width: "70%",
                    }}
                  >
                    <Select
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      sx={
                        context.language === "ar" && {
                          "& .MuiSvgIcon-root": {
                            left: "7px",
                            right: "auto",
                          },
                        }
                      }
                      name="way"
                      value={way}
                      onChange={(e) => setWay(e.target.value)}
                      fullWidth
                    >
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={way}
                        disabled
                      >
                        {context.language === "en"
                          ? "Select Way"
                          : "اختر طريقه"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"fixed"}
                      >
                        {context.language === "en" ? "Fixed" : "ثابت"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"com"}
                      >
                        {context.language === "en" ? "Commision" : "عموله"}
                      </MenuItem>
                    </Select>
                    {inputsData.map((input) => (
                      <InputText
                        key={input.name}
                        values={values}
                        name={input.name}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        way={way}
                        setChange={
                          input.name === "name"
                            ? setName
                            : input.name === "salary"
                            ? way === "fixed"
                              ? setSalary
                              : setPercentage
                            : input.name === "pwd"
                            ? setPwd
                            : input.name === "email"
                            ? setEmail
                            : setWay
                        }
                        label={context.language === "en" ? input.text : input.ar}
                      />
                    ))}

                    <Button type="submit" variant="contained">
                      {context.language === "en" ? "Submit" : "استمرار"}
                    </Button>
                  </form>
                )}
              </Formik>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <IconButton onClick={() => setIsTypeSelected("")}>
                {context.language === "en" ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <img
                style={{ width: 400, height: 400 }}
                src={otherLogo}
                alt="otherLogo"
              />
              <Formik
                initialValues={initialState}
                validationSchema={validateSchema}
                onSubmit={() => submitHandler()}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  handleChange,
                  errors,
                  values,
                  touched,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 10,
                      width: "70%",
                    }}
                  >
                    <Select
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      sx={
                        context.language === "ar" && {
                          "& .MuiSvgIcon-root": {
                            left: "7px",
                            right: "auto",
                          },
                        }
                      }
                      name="way"
                      value={way}
                      onChange={(e) => setWay(e.target.value)}
                      fullWidth
                    >
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={way}
                        disabled
                      >
                        {context.language === "en"
                          ? "Select Way"
                          : "اختر طريقه"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"fixed"}
                      >
                        {context.language === "en" ? "Fixed" : "ثابت"}
                      </MenuItem>
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        value={"com"}
                      >
                        {context.language === "en" ? "Commision" : "عموله"}
                      </MenuItem>
                    </Select>
                    {inputsData.map((input) => (
                      <InputText
                        key={input.name}
                        values={values}
                        name={input.name}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        way={way}
                        setChange={
                          input.name === "name"
                            ? setName
                            : input.name === "salary"
                            ? way === "fixed"
                              ? setSalary
                              : setPercentage
                            : input.name === "pwd"
                            ? setPwd
                            : input.name === "email"
                            ? setEmail
                            : setWay
                        }
                        label={
                          context.language === "en" ? input.text : input.ar
                        }
                      />
                    ))}

                    <Button type="submit" variant="contained">
                      {context.language === "en" ? "Submit" : "استمرار"}
                    </Button>
                  </form>
                )}
              </Formik>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const initialState = {
  name: "",
  salary: 0,
  way: "",
  pwd: "",
  email: "",
};

const validateSchema = yup.object().shape({
  name: yup.string().required("Name Required"),
  salary: yup.number().required("Salary Required"),
});

export default AddEmployee;
