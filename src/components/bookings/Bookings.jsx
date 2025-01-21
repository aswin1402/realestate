import React, { useEffect, useState } from 'react'
import { server_url } from '../../services/serverurl';
import { deleteSingleBookingsAPI, deleteSinglePropertyAPI, getBookAPI } from '../../services/allAPI';

const Bookings = () => {

    const [booked, setBooked] = useState([])
    console.log(booked);

    useEffect(() => {
        getBooked()
    }, [])

    const getBooked = async () => {
        const token = sessionStorage.getItem("token")
        const user = JSON.parse(sessionStorage.getItem("users"))
        if (token) {
            const reqHeader = {
                "Authorization": `Bearer ${token}`
            }
            try {
                const result = await getBookAPI(user._id, reqHeader)
                if (result.status == 200) {
                    setBooked(result.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        
    }

    //deletebookings
    const deleteBookings = async (id) => {
        const token = sessionStorage.getItem("token")
        if (token) {
            const reqHeader = {
                "Authorization": `Bearer ${token}`
            }
        

        try {
            const deletebooking=await deleteSingleBookingsAPI(id ,reqHeader)
            if(deletebooking.status==200){
                alert("Booking deleted successfully")
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }else{
        alert("Please login to delete booking")
    }
    }

    
  return (
    <div className='wrapper'>
        <div className="" style={{paddingTop: "150px"}}>
            <h1>Bookings</h1>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Bookings</h5>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">House name</th>
                                        <th scope="col">image</th>
                                        <th scope="col">username</th>
                                        <th scope="col">email</th>
                                        <th scope="col">date</th>
                                        <th scope="col">Action</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                 { booked?.length > 0?
                                    booked.map(books => (
                                        <tr key={books._id}>
                                            <td>{books?.prpName}</td>
                                            <td><img className='img-fluid' src={`${server_url}/uploads/${books?.prpPic}`} alt=""/></td>
                                            <td>{books?.username}</td>
                                            <td>{books?.useremail}</td>
                                            <td>{books.date}</td>
                                            <td><button className="btn btn-danger" onClick={() => deleteBookings(books._id
                                            )} >Delete the booking</button></td> 
                                            



                                        </tr>


                                    ))
                                    :
                                    <p>
                                        No bookings found
                                    </p>
                                    

                                }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    
    </div>
  )
}

export default Bookings
