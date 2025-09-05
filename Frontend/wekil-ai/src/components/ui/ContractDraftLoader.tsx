import { Loader2 } from 'lucide-react'
import React from 'react'

const ContractDraftLoader = ({currentLanguage}:{currentLanguage: "en"|"am"}) => {
  return (
    <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-teal-500" />
          <h3 className="text-lg font-medium">{currentLanguage == "en"? "Generating Draft...": "ረቂቅ በመፍጠር ላይ..."}</h3>
          <p className="text-muted-foreground">
            {currentLanguage === "en"
              ? "Please wait while we generate your agreement..."
              : "እባክዎ ውልዎን እያመነጨን ያለን ይጠብቁ..."}
          </p>
        </div>
      </div>
  )
}

export default ContractDraftLoader
