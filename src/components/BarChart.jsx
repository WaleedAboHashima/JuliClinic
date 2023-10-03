import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
// import { fetchBarData } from "./../apis/Info/BarChart";
import { LanguageContext } from "../language";
import { useContext } from "react";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = theme.palette;
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const context = useContext(LanguageContext);

  const mockBarData = [
    {
      country: "Tito",
      "hot dog": 137,
      "hot dogColor": "hsl(229, 70%, 50%)",
      burger: 96,
      burgerColor: "hsl(296, 70%, 50%)",
      kebab: 72,
      kebabColor: "hsl(97, 70%, 50%)",
      donut: 140,
      donutColor: "hsl(340, 70%, 50%)",
    },
    {
      "hot dog": 55,
      "hot dogColor": "hsl(307, 70%, 50%)",
      country: "Basha",
      burger: 28,
      كباب: 50,
      hotdog: 100,
      fries: 500,
      sandwich: 200,
      burgerColor: "hsl(111, 70%, 50%)",
      kebab: 58,
      kebabColor: "hsl(273, 70%, 50%)",
      donut: 29,
      donutColor: "hsl(275, 70%, 50%)",
    },
    {
      country: "Ferrari ",
      "hot dog": 109,
      "hot dogColor": "hsl(72, 70%, 50%)",
      burger: 23,
      burgerColor: "hsl(96, 70%, 50%)",
      kebab: 34,
      kebabColor: "hsl(106, 70%, 50%)",
      donut: 152,
      donutColor: "hsl(256, 70%, 50%)",
    },
  ];

  // useEffect(() => {
  //   dispatch(fetchBarData()).then((res) => {
  //     if (res.payload.data) {
  //       const categories = res.payload.data.final;
  //       const data = categories.flatMap((c) => {
  //         const categoryName = Object.keys(c)[0];
  //         const items = c[categoryName];
  //         const reducedItems = items.reduce((accumulator, item) => {
  //           const key = context.language === "en" ? item.name : item.nameAR;
  //           const value = item.quantity;
  //           const name = context.language === "en" ? item.name : item.nameAR;
  //           if (accumulator[categoryName]) {
  //             if (
  //               context.language === "en"
  //                 ? !accumulator[categoryName].name.includes(name)
  //                 : !accumulator[categoryName].nameAR.includes(name)
  //             ) {
  //               context.language === "en"
  //                 ? accumulator[categoryName].name.push(name)
  //                 : accumulator[categoryName].nameAR.push(name);
  //             }
  //             accumulator[categoryName][key] = value;
  //             accumulator[categoryName].value += value;
  //           } else {
  //             accumulator[categoryName] =
  //               context.language === "en"
  //                 ? {
  //                     category: categoryName,
  //                     [key]: value,
  //                     value,
  //                     name: [name],
  //                   }
  //                 : {
  //                     category: categoryName,
  //                     [key]: value,
  //                     value,
  //                     nameAR: [name],
  //                   };
  //           }
  //           return accumulator;
  //         }, {});
  //         return Object.values(reducedItems);
  //       });
  //       setData(data);
  //     }
  //   });
  // }, [dispatch, context]);
  return (
    <ResponsiveBar
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: theme.palette.mode === "dark" ? "black" : "white",
            color:
              theme.palette.mode === "dark" ? colors.primary[100] : "black",
          },
        },
      }}
      data={mockBarData}
      // keys={data.flatMap((d) =>
      //   context.language === "en" ? d.name : d.nameAR
      // )}
      keys={[
        'hot dog',
        'burger',
        'sandwich',
        'kebab',
        'fries',
        'donut'
    ]}
      indexBy="category"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection:
            context.language === "en" ? "left-to-right" : "right-to-left",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivobar chart demo"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in category: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
