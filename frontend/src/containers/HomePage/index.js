import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Home from "../../components/Home";

const HomePage = () => {
  return (
    <div>
      <div className="Header">
        <Header />
      </div>

      <div className="Body">
        <Home />
      </div>

    </div>
  );
};

export default HomePage;
