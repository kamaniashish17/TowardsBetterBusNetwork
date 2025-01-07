import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import BarChart from "../../components/Enhancement";

const EnhancementPage = () => {
  const location = useLocation();
  // console.log(location)
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="bar-chart-enhancement flex flex-col items-center justify-center h-screen">
        <BarChart data={location.state?.data} />
      </div>
    </div>
  );
};

export default EnhancementPage;
