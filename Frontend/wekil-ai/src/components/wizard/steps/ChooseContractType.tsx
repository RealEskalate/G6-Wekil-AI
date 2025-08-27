"use client"

import { Card } from "@/components/ui/Card"
import type { ContractData, Language } from "../ContractWizard"
import { Shield, ShoppingCart, CreditCard, Lock } from "lucide-react"

interface ChooseContractTypeProps {
  data: ContractData
  onUpdate: (data: Partial<ContractData>) => void
  currentLanguage: Language
}

const contractTypes = [
  {
    id: "service-agreement",
    title: "Service Agreement",
    titleAmharic: "የአገልግሎት ስምምነት",
    description: "For freelance work, consulting, and services",
    descriptionAmharic: "ለነጻ ስራ፣ አማካሪነት እና አገልግሎቶች",
    icon: Shield,
  },
  {
    id: "sale-of-goods",
    title: "Sale of Goods",
    titleAmharic: "የዕቃ ሽያጭ",
    description: "For buying and selling products or items",
    descriptionAmharic: "ምርቶችን ወይም እቃዎችን ለመግዛት እና ለመሸጥ",
    icon: ShoppingCart,
  },
  {
    id: "simple-loan",
    title: "Simple Loan",
    titleAmharic: "ቀለል ያለ ብድር",
    description: "For personal loans between individuals",
    descriptionAmharic: "በግለሰቦች መካከል ለግል ብድር",
    icon: CreditCard,
  },
  {
    id: "non-disclosure-agreement",
    title: "Non-Disclosure Agreement",
    titleAmharic: "የሚስጥር ጥበቃ ስምምነት",
    description: "To protect confidential information",
    descriptionAmharic: "ሚስጥራዊ መረጃን ለመጠበቅ",
    icon: Lock,
  },
]

const texts = {
  english: {
    chooseType: "Choose Contract Type",
    selectType: "Select the type of agreement you want to create",
  },
  amharic: {
    chooseType: "የውል አይነት ምረጥ",
    selectType: "መፍጠር የሚፈልጉትን የስምምነት አይነት ይምረጡ",
  },
}

export function ChooseContractType({ data, onUpdate, currentLanguage }: ChooseContractTypeProps) {
  const t = texts[currentLanguage]

  const handleSelect = (contractType: string) => {
    onUpdate({ contractType })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t.chooseType}</h2>
        <p className="text-gray-600">{t.selectType}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md bg-white ${
                data.contractType === type.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelect(type.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`p-3 rounded-full ${
                    data.contractType === type.id ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {currentLanguage === "english" ? type.title : type.titleAmharic}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {currentLanguage === "english" ? type.description : type.descriptionAmharic}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
