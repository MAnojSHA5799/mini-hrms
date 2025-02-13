import React, { useState } from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";
import festivalData from "../../views/admin/festivalData"; // Import your festival data

const MiniCalendar = () => {
  const [value, onChange] = useState(new Date());

  // Function to check if a given date has a festival
  const getFestivalForDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB"); // Format date as "DD-MM-YYYY"
    return festivalData.find(festival => festival.date === formattedDate);
  };

  // Adding custom class if the date matches a festival or is a weekend
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const festival = getFestivalForDate(date);
      if (festival) return "festival-day";
      
      // Check if the day is Saturday (6) or Sunday (0)
      if (date.getDay() === 6 || date.getDay() === 0) {
        return "weekend-day"; // Apply weekend class
      }
    }
    return null;
  };

  // Adding festival details inside the date tile
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const festival = getFestivalForDate(date);
      if (festival) {
        return (
          <div
            style={{
              background: festival.color,
              borderRadius: "50%",
              color: "#fff",
              padding: "5px",
              textAlign: "center",
              fontSize: "0.7rem"
            }}
          >
            {festival.name}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <Card extra="flex w-full h-full flex-col px-3 py-3">
        <Calendar
          onChange={onChange}
          value={value}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
          view={"month"}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </Card>
    </div>
  );
};

export default MiniCalendar;
