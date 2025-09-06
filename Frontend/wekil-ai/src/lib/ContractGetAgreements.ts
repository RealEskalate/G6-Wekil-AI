const baseUrl = "https://g6-wekil-ai-1.onrender.com";
export async function getAgreementDetailById(id:string,accessToken:string){
    try{
        const res = await fetch(`${baseUrl}/agreement`,{
            method:"POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"agreement_id":id})
        })
        
        if (!res.ok){
            throw new Error("Error");
        }

        const data = await res.json();

        return data;
    }catch(error){
        return error;
    }
}
export async function getAgreementByUserId(accessToken:string,pageNumber: number){
    try{
        const res = await fetch(`${baseUrl}/agreement/userID?page=${pageNumber}`,{
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })
        
        if (!res.ok){
            throw new Error("Error");
        }

        const data = await res.json();

        return data;
    }catch(error){
        return error;
    }
}   