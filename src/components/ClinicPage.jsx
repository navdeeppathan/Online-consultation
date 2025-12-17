import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import bgImage from "../assets/images/Background.png";
import YodocComingSoon from "./YodocComingSoon";

const ClinicPage = () => {
  return (
    <div
      className="backgroundimage"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        minHeight: "100%",
      }}
    >
      <Header />
      <div>
        <YodocComingSoon />
      </div>

      <Footer />
    </div>
  );
};

export default ClinicPage;
