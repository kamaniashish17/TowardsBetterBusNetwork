import React from "react";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import HeatMap from "../../components/HeatMap";
import PieChart from "../../components/PieChart";
import Legend from "../../components/Legend";

const GroupHeatMap = ({ source, destination }) => {
  const location = useLocation();
  console.log("Source, Destination", location.state);
  return (
    <div>
      <div>
        <Header showOptimalRouteButton={false} />
      </div>
      <div className="mt-8">
        <Legend />
      </div>
      <div id="heatmapGroup" className="w-full h-[600px]">
        <HeatMap
          apiUrl="http://localhost:8000/get/busRoutesHeatMap"
          Source={location.state.source}
          Destination={location.state.destination}
          decision={1}
          decisionStr="AvgCheckOut"
          color="#FFC300"
          id="avgCheckOut"
          xString="Route_Id"
          yString="TimeStamp"
          label="Routes"
        />
        <HeatMap
          apiUrl="http://localhost:8000/get/busRoutesHeatMap"
          Source={location.state.source}
          Destination={location.state.destination}
          decision={2}
          decisionStr="AvgCheckIn"
          color="#00B007"
          id="avgCheckIn"
          xString="Route_Id"
          yString="TimeStamp"
          label="Hourly"
        />
        <HeatMap
          apiUrl="http://localhost:8000/get/busRoutesHeatMap"
          Source={location.state.source}
          Destination={location.state.destination}
          decison={0}
          decisionStr="Average_Load"
          color="#3C007B"
          id="merged"
          xString="TimeStamp"
          yString="Route_Id"
          label=""
        />
        <PieChart
          apiUrl="http://localhost:8000/routes/getPieChartData"
          Source={location.state.source}
          Destination={location.state.destination}
        />
      </div>
    </div>
  );
};

export default GroupHeatMap;
