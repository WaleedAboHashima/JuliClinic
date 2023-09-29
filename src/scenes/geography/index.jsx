import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";
import Header from "components/Header";
import { LanguageContext } from "language";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { GetClientsHandler } from "apis/data/Clients/GetClients";
import axios from "axios";

const CustomMarker = ({ position, label, info, country }) => {
  const [isHovered, setIsHovered] = useState(false);
  const context = useContext(LanguageContext);
  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <>
      <Marker
        position={position}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 1,
            background: "white",
            padding: "8px",
            borderRadius: "4px",
            color: "black",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            top: 30,
          }}
        >
          {context.language === "en"
            ? `Total Customers in ${country} : ${info[country]}`
            : `عدد العملاء في ${country} هو : ${info[country]}`}
        </Box>
      )}
    </>
  );
};

const Geography = () => {
  const theme = useTheme();
  const context = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([
    {
      latitude: "",
      longitude: "",
    },
  ]);

  const mapOptions = {
    disableDefaultUI: true, // Hide default controls
    // streetViewControl: true,
    zoomControl: true, // Show zoom controls
    // mapTypeId: "satellite", // Set default display to satellite view
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const geocodeCountry = async (countryCode) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?components=country:${countryCode}&key=AIzaSyCewVD8Afv0cy6NGoCZkQ4PZRW3OQCFfHA`
      );
      const data = response.data;

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;

        setSelectedLocation((prevLocation) => [
          ...prevLocation,
          { latitude: lat, longitude: lng, code: countryCode },
        ]);
      }
      return null;
    } catch (error) {
      console.error("Error geocoding country:", error);
      return null;
    }
  };

  useEffect(() => {
    dispatch(GetClientsHandler()).then((res) => {
      if (res.payload.status === 200) {
        const countries = res.payload.data.clients.map(
          (client) => client.country
        );
        countries.map((country) => geocodeCountry(country));
        const clients = res.payload.data.clients;

        const countryCounts = {};

        clients.forEach((client) => {
          const country = client.country;
          if (countryCounts[country]) {
            countryCounts[country]++;
          } else {
            countryCounts[country] = 1;
          }
        });
        setInfo(countryCounts);
      }
    });
  }, [dispatch]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title={context.language === "en" ? "GEOGRAPHY" : "الموقع الجغرافي"}
        subtitle={
          context.language === "en"
            ? "Find where your users are located."
            : "مواقع المستخدمين."
        }
      />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
      >
        <LoadScript googleMapsApiKey="AIzaSyCewVD8Afv0cy6NGoCZkQ4PZRW3OQCFfHA">
          {loading ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
            >
              <CircularProgress />
            </Box>
          ) : (
            <GoogleMap
              options={mapOptions}
              mapContainerStyle={{ height: "100%", width: "100%" }}
              zoom={5}
              center={currentLocation}
            >
              {selectedLocation.map((location, index) => (
                <CustomMarker
                  key={index}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  info={info}
                  country={location.code}
                />
              ))}
            </GoogleMap>
          )}
        </LoadScript>
      </Box>
    </Box>
  );
};

export default Geography;
