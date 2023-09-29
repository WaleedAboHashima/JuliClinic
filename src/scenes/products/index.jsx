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
} from "@mui/material";
import Header from "components/Header";
import { useDispatch } from "react-redux";
import { GetUsersHandler } from "apis/data/Users/GetUsers";
import { LanguageContext } from "language";

const Product = ({ _id, username, email, role }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        {/* <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography> */}
        <Typography variant="h5" component="div">
          {username}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          {email}
        </Typography>
        {/* <Rating value={rating} readOnly /> */}

        {/* <Typography variant="body2">{description}</Typography> */}
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Role: {role}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const context = useContext(LanguageContext);
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   dispatch(GetUsersHandler()).then((res) => {
  //     if (res.payload) {
  //       setUsers(res.payload.data.users);
  //     }
  //   });
  // }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title={context.language === "en" ? "PRODUCTS" : "منتجات"} subtitle={context.language === "en" ? "See your list of products." : "قائمه المنتجات"} />
      {false ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {[].map(({ _id, username, role, email }) => (
            <Product
              key={_id}
              _id={_id}
              username={username}
              role={role}
              email={email}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
