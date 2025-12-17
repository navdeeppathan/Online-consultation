import React, { useState, useEffect } from "react";
import { Stethoscope } from "lucide-react";
import banner4 from "../assets/images/Vector (3).png";
import toast from "react-hot-toast";

const YodocComingSoon = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 45);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (email) {
      setSubscribed(true);

      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className=" min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-3">
      {/* Logo */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className=" text-white rounded-3">
          <img src={banner4} alt="" style={{ width: "80px", height: "80px" }} />
        </div>
        <div className="text-start">
          <h2 className="h3 fw-bold mb-0">Yodoc</h2>
          <small className="text-muted">Online Doctor Consultation</small>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="display-5 fw-bold mb-3">
        Healthcare{" "}
        <span className="text-primary d-block">At Your Fingertips</span>
      </h1>
      <p className="lead text-muted mb-4">
        Connect with certified doctors instantly from the comfort of your home.
        Quality healthcare made accessible for everyone.
      </p>

      {/* Countdown Timer */}
      <div className="d-flex justify-content-center gap-2 gap-md-3 mb-4 flex-wrap">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Minutes" },
          { value: timeLeft.seconds, label: "Seconds" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-3 shadow-sm p-3 px-4"
          >
            <div className="h4 text-primary mb-1">
              {item.value.toString().padStart(2, "0")}
            </div>
            <small className="text-muted">{item.label}</small>
          </div>
        ))}
      </div>

      {/* Subscription */}
      <div className="mb-4 w-100" style={{ maxWidth: "400px" }}>
        <div className="input-group mb-2">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubscribe}>
            Notify Me
          </button>
        </div>
        {subscribed && (
          <div className="alert alert-success py-2 mt-2" role="alert">
            Thank you! You'll receive early access when Yodoc launches.
          </div>
        )}
      </div>

      {/* Features */}
      <div className="row g-3 g-md-4 mb-5">
        {[
          {
            title: "24/7 Availability",
            desc: "Consult with doctors anytime, anywhere.",
          },
          {
            title: "Secure & Private",
            desc: "Your medical data stays confidential.",
          },
          {
            title: "Certified Doctors",
            desc: "Licensed healthcare professionals.",
          },
        ].map((feature, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card h-100 text-center p-3 shadow-sm">
              <h5 className="card-title fw-bold">{feature.title}</h5>
              <p className="card-text text-muted">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-muted small">
        <p>
          Questions? Contact us at <a href="yodoc@gmail.com">yodoc@gmail.com</a>
        </p>
        <p>
          Follow us: <a href="#">@yodochealth</a>
        </p>
      </footer>
    </div>
  );
};

export default YodocComingSoon;
