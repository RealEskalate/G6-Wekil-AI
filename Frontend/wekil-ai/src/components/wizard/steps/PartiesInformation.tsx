"use client"

import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import type { ContractData, Language } from "../ContractWizard"
import { User, Users } from "lucide-react"

interface PartiesInformationProps {
  data: ContractData
  onUpdate: (data: Partial<ContractData>) => void
  currentLanguage: Language;

}

export function PartiesInformation({ data, onUpdate, currentLanguage }: PartiesInformationProps) {
  const updateFirstParty = (field: string, value: string) => {
    onUpdate({
      firstParty: { ...data.firstParty, [field]: value },
    })
  }

  const updateSecondParty = (field: string, value: string) => {
    onUpdate({
      secondParty: { ...data.secondParty, [field]: value },
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Parties Information</h2>
        <p className="text-gray-600">Enter details for both parties involved in the agreement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Party */}
        <Card className="p-6 bg-white">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold">First Party</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="first-name">Full Name</Label>
              <Input
                id="first-name"
                placeholder="John Doe"
                value={data.firstParty.fullName}
                onChange={(e) => updateFirstParty("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="first-phone">Phone Number</Label>
              <Input
                id="first-phone"
                placeholder="+251..."
                value={data.firstParty.phone}
                onChange={(e) => updateFirstParty("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="first-email">Email Address</Label>
              <Input
                id="first-email"
                type="email"
                placeholder="john@example.com"
                value={data.firstParty.email}
                onChange={(e) => updateFirstParty("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="first-address">Location/Address</Label>
              <Input
                id="first-address"
                placeholder="Addis Ababa, Ethiopia"
                value={data.firstParty.address}
                onChange={(e) => updateFirstParty("address", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Second Party */}
        <Card className="p-6 bg-white">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold">Second Party</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="second-name">Full Name</Label>
              <Input
                id="second-name"
                placeholder="Jane Smith"
                value={data.secondParty.fullName}
                onChange={(e) => updateSecondParty("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="second-phone">Phone Number</Label>
              <Input
                id="second-phone"
                placeholder="+251..."
                value={data.secondParty.phone}
                onChange={(e) => updateSecondParty("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="second-email">Email Address</Label>
              <Input
                id="second-email"
                type="email"
                placeholder="jane@example.com"
                value={data.secondParty.email}
                onChange={(e) => updateSecondParty("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="second-address">Location/Address</Label>
              <Input
                id="second-address"
                placeholder="Addis Ababa, Ethiopia"
                value={data.secondParty.address}
                onChange={(e) => updateSecondParty("address", e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
