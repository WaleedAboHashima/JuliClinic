import { useTheme } from "@emotion/react";
import { ResponsivePie } from "@nivo/pie";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { GetServicesHandler } from "apis/Services/GetServices";

const PieChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    dispatch(GetServicesHandler()).then((res) => {
      if (res.payload.status === 200) {
        const services = res.payload.data.services;
        const chartData = services.map((service) => ({
          id: service.name,
          label: service.name,
          value: service.price,
          color: theme.palette.primary[500],
        }));
        setData(chartData);
      }
    });
  }, [dispatch]);
  return (
    <ResponsivePie
    
      theme={{
        legends: {
          text: {
            fill: theme.palette.grey[100],
          },
        },
        tooltip: {
          container: {
            background: theme.palette.mode === "dark" ? "black" : "white",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary[100]
                : "black",
          },
        },
      }}
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      enableArcLinkLabels={false}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabel={false}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "ruby",
          },
          id: "dots",
        },
        {
          match: {
            id: "c",
          },
          id: "dots",
        },
        {
          match: {
            id: "go",
          },
          id: "dots",
        },
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
        {
          match: {
            id: "lisp",
          },
          id: "lines",
        },
        {
          match: {
            id: "elixir",
          },
          id: "lines",
        },
        {
          match: {
            id: "javascript",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#FFF",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
