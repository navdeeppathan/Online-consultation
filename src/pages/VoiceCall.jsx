import React, { useEffect, useRef, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import axios from "axios";

const VoiceCall = () => {
  const deviceRef = useRef(null);
  const [identity, setIdentity] = useState("user1");
  const [to, setTo] = useState("+447879175585");

  const setupTwilio = async () => {
    try {
      const res = await axios.post("https://api.yodoc.co.uk/api/twilio/token", {
        identity,
      });

      const token = res.data.token;

      const device = new Device(token, { debug: true });

      device.on("registered", () => console.log("Twilio Device Ready"));
      device.on("error", (error) =>
        console.error("Twilio Device Error:", error)
      );
      device.on("incoming", (conn) => {
        console.log("Incoming call");
        conn.accept();
      });

      deviceRef.current = device;
      device.register();
    } catch (error) {
      console.error("Twilio Token Error:", error);
    }
  };

  const makeCall = () => {
    if (!deviceRef.current) return;

    const connection = deviceRef.current.connect({ params: { To: to } });

    // You can listen globally on the Device instead
    deviceRef.current.on("connect", () => {
      console.log("Call connected");
    });

    deviceRef.current.on("disconnect", () => {
      console.log("Call ended");
    });
  };

  useEffect(() => {
    setupTwilio();
  }, []);

  return (
    <div className="container">
      <h3>Twilio Voice Call</h3>
      <input
        type="text"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Enter phone number"
        className="form-control mb-2"
      />
      <button className="btn btn-primary" onClick={makeCall}>
        Call
      </button>
    </div>
  );
};

export default VoiceCall;
