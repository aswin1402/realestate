import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { server_url } from '../../services/serverurl';
import { addPropertyAPI, deleteSinglePropertyAPI, getAllowersPropertyAPI } from '../../services/allAPI'
import Edit from '../Edit';

const Addproperty = () => {
  const [preview, setPreview] = useState('')
  const [imageFileStatus, setImageFileStatus] = useState(false)
  const [property, SetProperty] = useState({
    name: "",
    price: "",
    address: "",
    description: "",
    propertyPic: ""
  })
  const [userId, setUserid] = useState("")
  const [myProperty, setMyProperty] = useState([])


 

  useEffect(() => {
    getAllOwnersProperty()
  }, [])

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('users'))
    if (user) {
      setUserid(user._id)
    }
  }, [])

  // Property Pic validation
  useEffect(() => {
    if (property.propertyPic && (property.propertyPic.type === 'image/png' || property.propertyPic.type === 'image/jpg' || property.propertyPic.type === 'image/jpeg')) {
      setImageFileStatus(true)
      setPreview(URL.createObjectURL(property.propertyPic))
    } else {
      SetProperty({ propertyPic: "" })
      setImageFileStatus(false)
      setPreview("")
    }
  }, [property.propertyPic])

  // Add Property
  const addProperty = async (e) => {
    e.preventDefault()
    const { name, price, address, description, propertyPic } = property
    if (name && price && address && description && propertyPic && userId) {
      const reqBody = new FormData()
      reqBody.append('name', name)
      reqBody.append('price', price)
      reqBody.append('address', address)
      reqBody.append('description', description)
      reqBody.append('userId', userId)
      reqBody.append('propertyPic', propertyPic)
      const token = sessionStorage.getItem("token")
      try {
        if (token) {
          const reqHeader = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
          const addProperty = await addPropertyAPI(reqBody, reqHeader)
          if (addProperty.status === 200) {
            toast.success("Property added successfully")
            SetProperty({ name: "", price: "", address: "", description: "", propertyPic: "" })
          } else {
            if (addProperty.status === 406) {
              alert(addProperty.response.data)
            }
          }
        } else {
          alert("Token is missing... please login")
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.info('Please fill all the fields')
    }
  }



  // Get All Owners Properties
  const getAllOwnersProperty = async () => {
    const token = sessionStorage.getItem("token")
    const user = JSON.parse(sessionStorage.getItem("users"))
    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }
      try {
        const result = await getAllowersPropertyAPI(user._id, reqHeader)
        if (result.status === 200) {
          // console.log("My Properties:", result.data)  // Log the properties for debugging
          setMyProperty(result.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Delete Property
  const Deleteproperty = async (id) => {
    const token = sessionStorage.getItem("token")

    // Check if the ID is valid
    if (!id || id === 'undefined' || id === '') {
      alert("Invalid Property ID")
      return
    }

    // Check if the user is logged in
    if (!token) {
      alert("Please login to delete property")
      return
    }

    const reqHeader = {
      "Authorization": `Bearer ${token}`,
    }

    try {
      // Call the API to delete the property
      const deleteproperty = await deleteSinglePropertyAPI(id, reqHeader)

      // If successful, show a success message
      if (deleteproperty.status === 200) {
        alert("Property deleted successfully")
        // Optionally, you can reload properties after deletion
        getAllOwnersProperty()
      } else {
        alert("Failed to delete property")
      }
    } catch (error) {
      console.log(error)
      alert("An error occurred while deleting the property")
    }
  }


  return (
    <div className="wrapper">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card d-flex flex-row justify-content-center align-items-center p-3 rounded" style={{ width: "1000px", height: "700px" }}>
          <div className="row">
            {/* Left Section: Image Upload */}
            <div className="col-6 d-flex align-items-center">
              <label>
                <input onChange={e => SetProperty({ ...property, propertyPic: e.target.files[0] })} width={"400px"} height={"300px"} type="file" />
                <img width={"400px"} height={"300px"} src={preview ? preview : ""} alt="" />
              </label>
            </div>
            {!imageFileStatus && <p className="text-center text-danger">Allowed File Types: JPG ,JPEG, PNG files !!!</p>}
          </div>

          {/* Right Section: Input Fields */}
          <div className="col-6 flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              <label className="text-secondary fw-bold" htmlFor="propertyName">Property Name</label>
              <input value={property.name} onChange={(e) => SetProperty({ ...property, name: e.target.value })} type="text" />
              <label className="text-secondary fw-bold" htmlFor="propertyPrice">Property Price</label>
              <input value={property.price} onChange={(e) => SetProperty({ ...property, price: e.target.value })} type="text" />
              <label className="text-secondary fw-bold" htmlFor="propertyAddress">Property Address</label>
              <input value={property.address} onChange={(e) => SetProperty({ ...property, address: e.target.value })} type="text" />
              <label className="text-secondary fw-bold" htmlFor="propertyDescription">Property Description</label>
              <input value={property.description} onChange={(e) => SetProperty({ ...property, description: e.target.value })} type="text" />
              <button onClick={addProperty} className="btn btn-primary mt-5" style={{ width: "200px", height: "50px" }} type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: "150px" }}>
        <h1>My Property</h1>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Property Name</th>
                      <th scope="col">Property Image</th>
                      <th scope="col">Property Price</th>
                      <th scope="col">Property Address</th>
                      <th scope="col">Property Description</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProperty.length > 0 ?
                      myProperty.map(house => (
                        <tr key={house._id}>
                          <td>{house.name}</td>
                          <td><img src={`${server_url}/uploads/${house.propertyPic}`} alt="image" style={{ width: "100" }} /></td>
                          <td>{house.price}</td>
                          <td>{house.address}</td>
                          <td>{house.description}</td>
                          <td>
                            <Edit myProperty={house}/>
                          </td>
                          <td><button className="btn btn-danger" onClick={() => Deleteproperty(house._id)}>Delete the property</button></td>
                        </tr>
                      )) :
                      <tr><td colSpan="6">No property found</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer autoClose={2000} theme="colored" position="top-center" />
    </div>
  )
}

export default Addproperty
