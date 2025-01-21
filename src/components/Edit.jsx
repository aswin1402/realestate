import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { editPropertyAPI } from '../services/allAPI';
import { server_url } from '../services/serverurl';
import { propertyUpdateResponseContext } from '../ContextAPI/ResponseContex';

const Edit = ({ myProperty }) => {

const {propertyUpdateResponse,setPropertyUpdateResponse}=useContext(propertyUpdateResponseContext)


    const [preview, setPreview] = useState('');
    const [fileStatus, setFileStatus] = useState(false);
    
    const [details, setDetails] = useState({
        name: myProperty?.name || '',
        price: myProperty?.price || '',
        address: myProperty?.address || '',
        description: myProperty?.description || '',
        propertyPic: myProperty?.propertyPic || '',
    });

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        // Reset form values when the modal is closed
        setDetails({
            name: myProperty?.name || '',
            price: myProperty?.price || '',
            address: myProperty?.address || '',
            description: myProperty?.description || '',
            propertyPic: myProperty?.propertyPic || '',
        });
    };

    const handleShow = () => {
        setShow(true);
    };

    // Handle image validation and preview
    useEffect(() => {
        if (
            details.propertyPic instanceof File && // Ensure it's a File object
            ['image/png', 'image/jpg', 'image/jpeg'].includes(details.propertyPic.type)
        ) {
            setFileStatus(true);
            setPreview(URL.createObjectURL(details.propertyPic)); // Generate a preview URL
        } else {
            setFileStatus(false);
            setPreview('');
        }
    }, [details.propertyPic]);

    const handleSubmit = async (id) => {
        const { name, price, address, description, propertyPic } = details;
        if (name && price && address && description && propertyPic) {
            const reqBody = new FormData();
            reqBody.append('name', name);
            reqBody.append('price', price);
            reqBody.append('address', address);
            reqBody.append('description', description);
            preview ? reqBody.append('propertyPic', propertyPic) : reqBody.append('propertyPic', myProperty.propertyPic);

            const token = sessionStorage.getItem('token');
            if (token) {
                const reqHeader = {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                };
                try {
                    const updateProperty = await editPropertyAPI(id, reqBody, reqHeader);
                    if (updateProperty.status === 200) {
                        alert('Property updated successfully');
                        setPropertyUpdateResponse(updateProperty)
                        handleClose();
                    }
                } catch (error) {
                    console.error(error);
                    alert('Failed to update the property. Please try again.'); // Added error feedback
                }
            }
        } else {
            alert('Please fill all the fields');
        }
    };

    return (
        <>
            <button onClick={handleShow} className="btn btn-success">
                Edit
            </button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>EDIT PROPERTY</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        {/* Left Side: Form Fields */}
                        <div className="w-50 pe-3">
                            <div className="mb-3">
                                <label>Property Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                    value={details.name}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label>Property Price:</label>
                                <input
                                    type="text"
                                    name="price"
                                    onChange={(e) => setDetails({ ...details, price: e.target.value })}
                                    value={details.price}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label>Property Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                                    value={details.address}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label>Property Description:</label>
                                <textarea
                                    name="description"
                                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                                    value={details.description}
                                    className="form-control"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Side: Image Display */}
                        <div className="w-50 d-flex flex-column align-items-center">
                            <label>
                                <input
                                    onChange={(e) => setDetails({ ...details, propertyPic: e.target.files[0] })}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    className="form-control mb-2"
                                    
                                />
                                 <img
                                        src={preview ? preview : `${server_url}/uploads/${myProperty.propertyPic}`}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                                    />
                            </label>
                            {!fileStatus && (
                                <p className="mt-1 text-center fw-bold text-warning">
                                    (Upload Only JPG, PNG, JPEG files!!!)
                                </p>
                            )}
                            <div
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    border: '1px solid #ddd',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '5px',
                                }}
                            >
                               
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={() => handleSubmit(myProperty?._id)} variant="primary">
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Edit;
