import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { bookingPostAPI, getPropertyByIdAPI } from '../../services/allAPI';
import { server_url } from '../../services/serverurl';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Property.css";
import { toast, ToastContainer } from 'react-toastify';

// Custom validation for MongoDB ObjectId format
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const PropertyDetails = () => {
  const { propertyId } = useParams(); // Get the propertyId from URL
  const [property, setProperty] = useState(null); // Initialize property as null
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Manage calendar visibility
  const [selectedDate, setSelectedDate] = useState(null); // Store the selected date
  const [bookingDetails, setBookingDetails] = useState({
    prpId: "", prpName: "", prpPic: "", userId: "", username: "", useremail: "", date: "",ownerId:""
  });

  // Log bookingDetails to debug
  console.log(bookingDetails);

  useEffect(() => {
    console.log("Property ID from URL:", propertyId); // Log to debug

    // Check if the propertyId is valid
    if (!isValidObjectId(propertyId)) {
      console.error("Invalid propertyId:", propertyId);
      alert("Invalid property ID.");
      return;
    }

    // Fetch property details
    const fetchPropertyDetails = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        const reqHeader = { Authorization: `Bearer ${token}` };
        try {
          const result = await getPropertyByIdAPI(propertyId, reqHeader);
          if (result) {
            console.log("Fetched Property Details: ", result);
            setProperty(result); // Set the property details in state
          } else {
            alert("Property not found");
          }
        } catch (error) {
          console.error("Error fetching property details:", error);
          alert("Failed to fetch property details");
        }
      } else {
        alert("Please login. Token is missing.");
      }
    };

    fetchPropertyDetails();
  }, [propertyId]); // Re-fetch when propertyId changes

  // Add conditional rendering for loading state
  if (property === null) return <div>Loading...</div>; // Handle loading state

  const handleBookClick = () => {
    setIsCalendarOpen(true); // Open the calendar modal
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false); // Close the calendar
  };

  const today = new Date();

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime; // Returns true if expired
    } catch (error) {
      return true; // Treat as expired if decoding fails
    }
  };

  // Handle the booking submission
  const handleBooking = async () => {
    if (selectedDate) {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("users"));

      if (!token) {
        alert("Token missing");
        return;
      }

      // Check if token is expired before proceeding
      // if (isTokenExpired(token)) {
      //   alert("Token has expired. Please log in again.");
      //   return;
      // }

      // Construct the request payload directly (without relying on state)
      const bookingPayload = {
        prpId: property._id,
        prpName: property.name,
        prpPic: property.propertyPic,
        userId: user._id,
        username: user.name,
        useremail: user.email,
        date: selectedDate,
        ownerId:property.userId

      };

      // Set request header with token
      const reqHeader = { Authorization: `Bearer ${token}` };

      try {
        const result = await bookingPostAPI(bookingPayload, reqHeader);
        console.log("API Response:", result);

        if (result.status === 200) {
          toast.success("Booking successful");
        } else if (result.status === 406) {
          alert(result.response.data);
        } else {
          alert("Booking failed. Please try again.");
        }
      } catch (error) {
        console.log("Error during booking:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a date.");
    }
  };

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        <img
          src={`${server_url}/uploads/${property.propertyPic}`}
          alt={property.name}
          className="property-image-large"
        />
        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{property.name}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                $ {property.price}
              </span>
            </div>
            <div className="flexStart facilities">
              <div className="flexStart facility">
                <span>Bathrooms: {property.bathrooms || "Available"}</span>
              </div>
              <div className="flexStart facility">
                <span>Parking: {property.parking || "Available"}</span>
              </div>
              <div className="flexStart facility">
                <span>Rooms: {property.rooms || "Available"}</span>
              </div>
            </div>
            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {property.description || "No description available."}
            </span>
            <div className="flexStart" style={{ gap: "1rem" }}>
              <span className="secondaryText">
                Address: {property.address || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <button className="button" onClick={handleBookClick}>
            Date of Book
          </button>

          {isCalendarOpen && (
            <div className="calendar-modal p-5">
              <div className="calendar-overlay" onClick={handleCloseCalendar}></div>
              <button onClick={handleCloseCalendar}><i style={{ color: "red", borderColor: "white" }} className='fa-solid fa-close'></i></button>
              <div className="calendar-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)} // Update date state
                  inline
                  dateFormat="MMMM d, yyyy" // Optional date format
                  minDate={today}
                />
                <Button onClick={handleBooking}>
                  Book to visit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
       <ToastContainer autoClose={2000} theme="colored" position="top-center" />
    </div>
  );
};

export default PropertyDetails;
