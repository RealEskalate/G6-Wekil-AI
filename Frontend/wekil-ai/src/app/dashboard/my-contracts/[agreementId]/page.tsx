import React from 'react'

const ViewContractPage = async ({params}:{params: Promise<{agreementId: string}>}) => {
    const {agreementId} = await params;
    
  return (
    <div className='bg-white'>
        {agreementId}
    </div>
  )
}

export default ViewContractPage;
