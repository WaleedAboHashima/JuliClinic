import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import React, { useContext, useEffect, useState } from "react";
import ServicesLogo from "assets/services.svg";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { GetStaffHandler } from "apis/data/Staff/GetStaff";
import { GetServicesHandler } from "apis/Services/GetServices";
import { AddServicesHandler } from "apis/Services/AddServices";

const AddService = () => {
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(['doct1']);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    dispatch(AddServicesHandler({ doctors: selectedDoctor, name, price })).then(
      (res) => {
        if (res.payload.status === 201) {
          window.location.pathname = "/services";
        }
      }
    );
  };

  useEffect(() => {
    dispatch(GetStaffHandler()).then((res) => {
      if (res.payload.status === 200) {
        const doctors = res.payload.data.StaffList.filter(
          (staff) => staff.type === "DOCTOR"
        );
        setDoctors(doctors);
        setSelectedDoctor([doctors[0]._id]); // Set initial selected doctor IDs
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
          title={context.language === "en" ? "Add Service" : "اضافه خدمه"}
          subtitle={
            context.language === "en" ? "Add Service below" : "اضافه خدمات"
          }
        />
      </Box>
      <Box display={"flex"} alignItems={"center"} height={"75vh"} flexDirection={'column'}>
        <img
          style={{ width: 450, height: 450 }}
          src={ServicesLogo}
          alt="servicesLogo"
        />

        <Box
          height={"100%"}
          width={"50%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ name: "", price: "" }}
          >
            {({ handleChange, handleSubmit, handleBlur, values, errors }) => (
              <form
                onSubmit={handleSubmit}
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
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  multiple
                >
                  <MenuItem dir={context.language === "ar" && "rtl"} disabled>
                    {context.language === "en" ? "Select a doctor" : "اختر الطبيب"}
                  </MenuItem>
                  {doctors.length > 0 &&
                    doctors.map((doctor) => (
                      <MenuItem dir={context.language === "ar" && "rtl"} key={doctor._id} value={doctor._id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                </Select>
                <TextField
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  onChangeCapture={(e) => setName(e.target.value)}
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Service Name" : "اسم الخدمه"
                  }
                />
                <TextField
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onChangeCapture={(e) => setPrice(e.target.value)}
                  dir={context.language === "en" ? "ltr" : "rtl"}
                  fullWidth
                  placeholder={
                    context.language === "en" ? "Price" : "سعر الخدمه"
                  }
                />
                <Button type="submit" variant="contained">
                  {context.language === "en" ? "Submit" : "استمرار"}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default AddService;