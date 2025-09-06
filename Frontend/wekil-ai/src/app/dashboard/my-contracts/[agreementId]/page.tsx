import React from 'react'
import ShowAgreement from './ShowAgreement';


const ViewContractPage = async ({params}:{params: Promise<{agreementId: string}>}) => {
    const {agreementId} = await params;
    
  return (
    <div className='bg-white'>
        <ShowAgreement id={agreementId} />
    </div>
  )
}

export default ViewContractPage;
