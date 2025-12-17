import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

const YodocCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCharges = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/yodoc-charges`);
      if (res.data.success) {
        setCharges(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch charges");
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const handleAmountChange = (id, value) => {
    setCharges((prev) =>
      prev.map((charge) =>
        charge.id === id ? { ...charge, charge_amount: value } : charge
      )
    );
  };

  const handleSave = async (charge) => {
    setLoading(true);
    try {
      const res = await axios.post(`${Config.BASE_URL}/api/yodoc-charges`, {
        type: charge.type,
        charge_amount: charge.charge_amount,
      });
      toast.success(res.data.message);
      fetchCharges();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update");
    }
    setLoading(false);
  };

  return (
    <div className="d-flex">
      {/* <Toaster position="top-right" /> */}
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminNavbar />

        <div className="container my-4">
          <h2 className="mb-4">Yodoc Charges</h2>

          {charges.map((charge) => (
            <div key={charge.id} className="row align-items-center mb-3 p-3 ">
              <div className="col-12 col-md-3 mb-2 mb-md-0">
                <label className="fw-bold">Yodoc Charge:</label>
              </div>

              <div className="col-6 col-md-3 mb-2 mb-md-0">
                <input
                  type="number"
                  value={charge.charge_amount}
                  onChange={(e) =>
                    handleAmountChange(charge.id, e.target.value)
                  }
                  className="form-control text-center"
                />
              </div>

              <div className="col-2 col-md-1 mb-2 mb-md-0">
                <span className="fw-bold">%</span>
              </div>

              <div className="col-12 col-md-3">
                <button
                  onClick={() => handleSave(charge)}
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YodocCharges;
