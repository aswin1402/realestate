import commonAPI from './CommonAPI'
import { server_url } from "./serverurl"




//registerAPI
export const registerAPI= async (user) => {
return await commonAPI('POST',`${server_url}/register`,user,"")
}

//loginAPI
export const loginAPI=async (user) => {
    return await commonAPI('POST',`${server_url}/login`,user,"")
    
}

//addprojectAPI
export const addPropertyAPI=async (reqBody,reqHeader) => {
    return await commonAPI('POST',`${server_url}/addProperty`,reqBody,reqHeader)
}

//getpropertyAPI
export const getUploadedPropertyAPI =async (field,value) => {
    return await commonAPI ("GET",`${server_url}/getUploadedProperty?field=${field}&value=${value}`,{})
}


//getpropertybyId
export const getPropertyByIdAPI = async (id, headers) => {
    try {
      const response = await commonAPI("GET", `${server_url}/getproperty/${id}`, null, headers);
      return response.data;
    } catch (error) {
      console.error("Error fetching property by ID:", error);
      throw error;
    }
  };
  
  // bookingpost
  export const bookingPostAPI=async (reqBody,reqHeader) => {
    return await commonAPI('POST',`${server_url}/bookRequest`,reqBody,reqHeader)
}

//getbookAPI
export const getBookAPI=async (id,reqHeader) => {
  return await commonAPI('GET',`${server_url}/getbooked/${id}/get`,{},reqHeader)
}

//getallowerspropery
export const getAllowersPropertyAPI = async (id, reqHeader) => {
  return await commonAPI('GET',`${server_url}/getallownerproperty/${id}/get`,{},reqHeader)
}
 

//deletesinglebookingsAPI
export const deleteSingleBookingsAPI=async (id ,reqHeader) => {
  return await commonAPI('DELETE',`${server_url}/deletebooking/${id}/delete`,{} ,reqHeader )
}
  

//deletesingleProperty
export const deleteSinglePropertyAPI=async (id ,reqHeader) => {
  return await commonAPI('DELETE',`${server_url}/deleteproperty/${id}/delete`,{},reqHeader)
  
}
 

//editproperty
export const editPropertyAPI = async (id, reqBody, reqHeader) => {
  return await commonAPI('PUT', `${server_url}/updateproperty/${id}/update`, reqBody, reqHeader)

}



