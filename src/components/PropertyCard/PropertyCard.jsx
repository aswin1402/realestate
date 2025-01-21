import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { getUploadedPropertyAPI } from '../../services/allAPI'
import { server_url } from '../../services/serverurl'
import "./PropertyCard.css"

const PropertyCard = () => {
  const [searchkey, setSearchkey] = useState("");
  const [filterValue, setFiltervalue] = useState("name");
  const [uploadProperty, setUPloadProperty] = useState([]);

  const navigate = useNavigate();

  // Fetching all uploaded properties
  useEffect(() => {
    getUploadedProperty();
  }, [filterValue, searchkey]);

  // Fetch uploaded properties based on search and filter
  const getUploadedProperty = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      };
      const field = filterValue;
      const value = searchkey;
      try {
        const result = await getUploadedPropertyAPI(field, value, reqHeader);
        if (result.status === 200) {
          setUPloadProperty(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please login, token is missing");
    }
  };

  return (
    <>
      <div className="flexCenter search-bar">
        <input
          onChange={(e) => setSearchkey(e.target.value)}
          placeholder={`Search property by ${filterValue}`}
          type="text"
        />
      </div>

      <div>
        <select
          onChange={(e) => setFiltervalue(e.target.value)}
          style={{ border: "none", width: "20px" }}
          className='bg-light text-dark'
        >
          <option selected hidden disabled className='text-dark' value=""></option>
          <option value="name">name</option>
          <option value="price">price</option>
        </select>
      </div>

      {uploadProperty?.length > 0 ? (
        <div className="property-list">
          {uploadProperty?.map((property, index) => (
            <div key={index} className="property-item">
              {/* Image on the left side */}
              <div className="property-image-container">
                {/* Link to the property detail page using the property._id */}
                <Link to={`/properties/${property._id}`}>
                  <img
                    width={"800px"}
                    height={"300px"}
                    src={`${server_url}/uploads/${property?.propertyPic}`}
                    alt="home"
                    className="property-image"
                  />
                </Link>
              </div>

              {/* Property details on the right side */}
              <div className="property-details">
                <div className="property-name-price">
                  <span className="property-name">{property?.name}</span>
                  <span className="property-price">
                    <span style={{ color: "orange" }}>$</span>
                    <span>{property?.price}</span>
                  </span>
                </div>
                <span className="property-address">{property?.address}</span>
                <span className="property-description">{property?.description}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-properties-message">No Properties Found</div>
      )}
    </>
  );
};

export default PropertyCard;
