import React from 'react'
import './Properties.css'
import PropertyCard from '../../components/PropertyCard/PropertyCard'


const Properties = () => {
  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
      

        

        <div className="paddings flexCenter properties">
         
       <PropertyCard/>
        
        </div>
      </div>
    </div>
  )
}

export default Properties
