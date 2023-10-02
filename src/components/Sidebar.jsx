import React, { useContext } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  DnsOutlined,
  GroupOutlined,
  ChevronLeftOutlined,
  ChevronRight,
  AccessTimeFilledOutlined,
  Inventory2Outlined,
  PersonOutlined,
  ReportGmailerrorredRounded,
  ListOutlined
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import { motion } from "framer-motion";
import { LanguageContext } from "language";
import logo from "assets/Logo.png";
import logoLight from "assets/Logo.jpg";
import Cookies from "universal-cookie";

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const navItems = [
    {
      text: context.language === "en" ? "Dashboard" : "لوحه التحكم",
      icon: <HomeOutlined />,
      url: "dashboard",
    },
    {
      text: context.language === "en" ? "Data" : "بيانات",
      icon: null,
    },
    {
      text: context.language === "en" ? "Employees" : "موظفيين",
      icon: <Groups2Outlined />,
      url: "employees",
    },
    {
      text: context.language === "en" ? "Users" : "مستخدمون",
      icon: <GroupOutlined />,
      url: "users",
    },
    {
      text: context.language === "en" ? "Clients" : "عملاء",
      icon: <PersonOutlined />,
      url: "clients",
    },
    {
      text: context.language === "en" ? "Appointments" : "المواعيد",
      icon: <ListOutlined />,
      url: "orders",
    },
    {
      text: context.language === "en" ? "Geography" : "الموقع الجغرافي",
      icon: <PublicOutlined />,
      url: "geography",
    },
    {
      text: context.language === "en" ? "Attendance" : "الحضور",
      icon: <AccessTimeFilledOutlined />,
      url: "attendance",
    },
    {
      text: context.language === "en" ? "System" : "النظام",
      icon: null,
    },
    {
      text: context.language === "en" ? "Services" : "الخدمات",
      icon: <DnsOutlined />,
      url: "services",
    },
    {
      text: context.language === "en" ? "Reports" : "التقارير",
      icon: <ReportGmailerrorredRounded />,
      url: "reports",
    },
    {
      text: context.language === "en" ? "Bills" : "الفواتير",
      icon: <ReceiptLongOutlined />,
      url: "bills",
    },
    {
      text: context.language === "en" ? "Inventory" : "المخذن",
      icon: <Inventory2Outlined />,
      url: "inventory",
    },

    // {
    //   text: "Admin",
    //   icon: <AdminPanelSettingsOutlined />,
    // },
    // {
    //   text: "Performance",
    //   icon: <TrendingUpOutlined />,
    // },
  ];
  const userItems = [
    {
      text: context.language === "en" ? "Data" : "بيانات",
      icon: null,
    },
    {
      text: context.language === "en" ? "Clients" : "عملاء",
      icon: <PersonOutlined />,
      url: "clients",
    },
    {
      text: context.language === "en" ? "Appointments" : "المواعيد",
      icon: <ListOutlined />,
      url: "orders",
    },
  ];
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <motion.Box
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isSidebarOpen ? 1 : 0, y: isSidebarOpen ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {isSidebarOpen && (
        <Drawer
          dir={context.language === "en" ? "ltr" : "rtl"}
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor={context.language === "en" ? "left" : "right"}
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <img
                    style={{ objectFit: "cover", borderRadius: "99px" }}
                    width={"100%"}
                    src={theme.palette.mode === "dark" ? logo : logoLight}
                    alt="company logo"
                  />
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {context.language === "en" ? (
                      <ChevronLeft />
                    ) : (
                      <ChevronRight />
                    )}
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {cookies.get("_auth_role") === "Admin"
                ? navItems.map(({ text, icon, url }) => {
                    if (!icon) {
                      return (
                        <Typography
                          key={text}
                          sx={{
                            m:
                              context.language === "en"
                                ? "2.25rem 0 1rem 3rem"
                                : "2.25rem 3rem 1rem 0",
                          }}
                        >
                          {text}
                        </Typography>
                      );
                    }
                    const lcText = text.toLowerCase();

                    return (
                      <ListItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        key={text}
                        disablePadding
                      >
                        <ListItemButton
                          onClick={() => {
                            navigate(`/${url}`);
                            setActive(lcText);
                          }}
                          sx={{
                            backgroundColor:
                              active === url
                                ? theme.palette.background.default
                                : "transparent",
                            color:
                              active === url
                                ? theme.palette.primary[200]
                                : theme.palette.primary[500],
                            borderRadius:
                              context.language === "en"
                                ? "20px 0px 0px 20px"
                                : "0px 20px 20px 0px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: context.language === "en" && "2rem",
                              mr: context.language === "ar" && "2rem",
                              color:
                                active === url
                                  ? theme.palette.primary[200]
                                  : theme.palette.grey[500],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={text}
                            sx={{
                              textAlign:
                                context.language === "en" ? "left" : "right",
                            }}
                          />
                          {active === url &&
                            (context.language === "en" ? (
                              <ChevronRightOutlined sx={{ ml: "auto" }} />
                            ) : (
                              <ChevronLeftOutlined sx={{ mr: "auto" }} />
                            ))}
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                : userItems.map(({ text, icon, url }) => {
                    if (!icon) {
                      return (
                        <Typography
                          key={text}
                          sx={{
                            m:
                              context.language === "en"
                                ? "2.25rem 0 1rem 3rem"
                                : "2.25rem 3rem 1rem 0",
                          }}
                        >
                          {text}
                        </Typography>
                      );
                    }
                    const lcText = text.toLowerCase();

                    return (
                      <ListItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        key={text}
                        disablePadding
                      >
                        <ListItemButton
                          onClick={() => {
                            navigate(`/${url}`);
                            setActive(lcText);
                          }}
                          sx={{
                            backgroundColor:
                              active === url
                                ? theme.palette.background.default
                                : "transparent",
                            color:
                              active === url
                                ? theme.palette.primary[200]
                                : theme.palette.primary[500],
                            borderRadius:
                              context.language === "en"
                                ? "20px 0px 0px 20px"
                                : "0px 20px 20px 0px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: context.language === "en" && "2rem",
                              mr: context.language === "ar" && "2rem",
                              color:
                                active === url
                                  ? theme.palette.primary[200]
                                  : theme.palette.grey[500],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={text}
                            sx={{
                              textAlign:
                                context.language === "en" ? "left" : "right",
                            }}
                          />
                          {active === url &&
                            (context.language === "en" ? (
                              <ChevronRightOutlined sx={{ ml: "auto" }} />
                            ) : (
                              <ChevronLeftOutlined sx={{ mr: "auto" }} />
                            ))}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
            </List>
          </Box>
        </Drawer>
      )}
    </motion.Box>
  );
};

export default Sidebar;
