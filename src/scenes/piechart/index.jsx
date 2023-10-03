import Header from "../../components/Header";
import { Box } from "@mui/material";
import PieChart from "./../../components/PieChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh" sx={{ direction: "ltr" }}>
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
