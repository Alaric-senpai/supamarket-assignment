import React from 'react'

const ClientDashboardLayout = ({children}: {children:React.ReactNode}) => {
  return (
    <div>

{/* sidebar and other client shared navigation will be added here */}

        {children}
    </div>
  )
}

export default ClientDashboardLayout