import { React } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

import "./App.css";
import HomePage from "./containers/HomePage";
import RoutesPage from "./containers/RoutesPage";
import NetworkAnalysisPage from "./containers/NetworkAnalysisPage";
import HeatMap from "./containers/HeatMapPage";
import EnhancementPage from "./containers/EnhancementPage";

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/network-analysis",
      element: <NetworkAnalysisPage />,
    },
    {
      path: "/routes/:source/:destination",
      element: <RoutesPage />,
    },
    {
      path: "/heatMap/:source/:destination",
      element: <HeatMap />,
    },
    {
      path:"/route-level-analysis",
      element: <EnhancementPage />
    }
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
