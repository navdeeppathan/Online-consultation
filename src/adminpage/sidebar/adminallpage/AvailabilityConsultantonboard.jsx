import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";

const AvailableDays = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [applyOption, setApplyOption] = useState("1");
  const [selectedDates, setSelectedDates] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = new Date().getMonth();

  const monthOptions = months.map((month, idx) => ({
    value: idx,
    label: month,
    isDisabled: idx < currentMonthIndex,
  }));

  useEffect(() => {
    let datesToAdd = [];
    if (applyOption === "1") {
      datesToAdd = [new Date(date)];
    } else {
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i);
        datesToAdd.push(newDate);
      }
    }

    const updated = datesToAdd.map((d) => ({
      date: d,
      startTime,
      endTime,
    }));

    setSelectedDates(updated);
  }, [date, startTime, endTime, applyOption]);

  const isSelected = (day) =>
    selectedDates.some((e) => e.date.toDateString() === day.toDateString());

  const tileClassName = ({ date: calDate, view }) => {
    if (view === "month" && isSelected(calDate)) {
      return "selected-day";
    }
    return null;
  };

  const handleDelete = (index) => {
    const updated = [...selectedDates];
    updated.splice(index, 1);
    setSelectedDates(updated);
  };

  const handleCreate = () => {
    console.log("Submitted data:", selectedDates);
    alert("Data submitted!");
  };

  const handleMonthChange = (option) => {
    const newDate = new Date(date);
    newDate.setMonth(option.value);
    setDate(newDate);
  };

  return (
    <Container fluid className="p-3">
      <style>{`
        .calendar-container {
          border: none;
          background: white;
          border-radius: 12px;
          font-family: Arial, sans-serif;
          width: 100%;
        }

        .calendar-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .react-calendar {
          border: none;
          background: transparent;
          width: 100% !important;
          max-width: 100% !important;
        }

        .react-calendar__navigation {
          display: none !important;
        }

        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .react-calendar__tile {
          aspect-ratio: 1 / 1;
          width: 100%;
          max-width: 45px;
          height: 45px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .react-calendar__tile:hover {
          background: #e2e8f0;
          border-radius: 50%;
        }

        .selected-day {
          background: #4ade80 !important;
          color: white !important;
          border-radius: 50% !important;
          font-weight: bold;
        }

        .react-calendar__tile--now {
          background: none;
          border: 1px solid #ccc;
          border-radius: 50%;
        }
      `}</style>

      <Row className="bg-white p-3 rounded shadow-sm">
        {/* Calendar Section */}
        <Col xs={12} md={8} className="mb-4 mb-md-0">
          <div className="calendar-container p-3">
            <div className="calendar-header">
              <h5 className="mb-2 mb-md-0">{months[date.getMonth()]}</h5>
              <div style={{ minWidth: "120px" }}>
                <Select
                  options={monthOptions}
                  value={{
                    value: date.getMonth(),
                    label: months[date.getMonth()],
                  }}
                  onChange={handleMonthChange}
                  isOptionDisabled={(option) => option.isDisabled}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
            </div>
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              prevLabel={null}
              nextLabel={null}
              prev2Label={null}
              next2Label={null}
            />
          </div>
        </Col>

        {/* Form Section */}
        <Col xs={12} md={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="radio"
                label="Availability for 1 day"
                name="applyOption"
                value="1"
                checked={applyOption === "1"}
                onChange={(e) => setApplyOption(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Availability for next 7 days"
                name="applyOption"
                value="7"
                checked={applyOption === "7"}
                onChange={(e) => setApplyOption(e.target.value)}
              />
            </Form.Group>

            <Button
              className="w-100 py-2"
              style={{ backgroundColor: "#3F5DFF", border: "none" }}
              onClick={handleCreate}
            >
              Create
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Selected Dates List */}
      <div className="mt-4">
        {selectedDates.map((entry, index) => (
          <div
            key={index}
            className="d-flex flex-wrap justify-content-between align-items-center border rounded p-2 mb-2"
          >
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2 mb-sm-0">
              <span>
                <strong>Date:</strong>{" "}
                {entry.date.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-muted">|</span>
              <span>
                <strong>Time:</strong> {entry.startTime} - {entry.endTime}
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(index)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default AvailableDays;
