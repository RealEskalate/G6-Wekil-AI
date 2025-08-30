// "use client";
// import React from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { Language, ContractData } from "@/components/wizard/ContractWizard";

// interface ContractPreviewProps {
//   currentLanguage: Language;
//   contractData: ContractData;
// }

// export default function ContractPreview({ currentLanguage, contractData }: ContractPreviewProps) {
//   const t = {
//     en: {
//       title: "Contract Preview",
//       subtitle: "Review your agreement details",
//       contractType: "Contract Type",
//       language: "Agreement Language",
//       description: "Description",
//       parties: "Parties",
//       commonDetails: "Common Details",
//       location: "Location",
//       totalAmount: "Total Amount",
//       currency: "Currency",
//       startDate: "Start Date",
//       endDate: "End Date",
//       dueDates: "Due Dates",
//       specificDetails: "Specific Details",
//       servicesDescription: "Services Description",
//       milestones: "Milestones",
//       milestoneDescription: "Description",
//       milestoneDate: "Date",
//       revisions: "Number of Revisions",
//       goodsTitle: "Goods/Items",
//       itemDescription: "Item Description",
//       quantity: "Quantity",
//       unitPrice: "Unit Price",
//       deliveryTerms: "Delivery Terms",
//       principalAmount: "Principal Amount",
//       installments: "Installments",
//       installmentAmount: "Amount",
//       installmentDueDate: "Due Date",
//       lateFeePercentage: "Late Fee Percentage",
//       effectiveDate: "Effective Date",
//       confidentialityPeriod: "Confidentiality Period (Years)",
//       purpose: "Purpose",
//     },
//     am: {
//       title: "የውል ቅድመ እይታ",
//       subtitle: "የውሉን ዝርዝሮች ይገምግሙ",
//       contractType: "የውል አይነት",
//       language: "የውል ቋንቋ",
//       description: "መግለጫ",
//       parties: "ተዋዋዮች",
//       commonDetails: "የጋራ ዝርዝሮች",
//       location: "ቦታ",
//       totalAmount: "ጠቅላላ መጠን",
//       currency: "መገበያዥ",
//       startDate: "መጀመሪያ ቀን",
//       endDate: "መጨረሻ ቀን",
//       dueDates: "የሚከፈልባቸው ቀናት",
//       specificDetails: "የተወሰኑ ዝርዝሮች",
//       servicesDescription: "የአገልግሎት መግለጫ",
//       milestones: "የሥራ ደረጃዎች",
//       milestoneDescription: "መግለጫ",
//       milestoneDate: "ቀን",
//       revisions: "የእርማት ብዛት",
//       goodsTitle: "ዕቃዎች",
//       itemDescription: "የዕቃ መግለጫ",
//       quantity: "ብዛት",
//       unitPrice: "የአንዱ ዋጋ",
//       deliveryTerms: "የመላኪያ ውሎች",
//       principalAmount: "ዋና መጠን",
//       installments: "ክፍያዎች",
//       installmentAmount: "መጠን",
//       installmentDueDate: "የሚከፈልበት ቀን",
//       lateFeePercentage: "የዘግይቶ ክፍያ መቶኛ",
//       effectiveDate: "የመጀመሪያ ቀን",
//       confidentialityPeriod: "የምስጢርነት ጊዜ (ዓመታት)",
//       purpose: "ዓላማ",
//     },
//   }[currentLanguage];

//   const partyLabels = {
//     service: [t.en.party1Label || "Service Provider", t.en.party2Label || "Client"],
//     goods: [t.en.party1Label || "Seller", t.en.party2Label || "Buyer"],
//     loan: [t.en.party1Label || "Lender", t.en.party2Label || "Borrower"],
//     nda: [t.en.party1Label || "Disclosing Party", t.en.party2Label || "Receiving Party"],
//   }[contractData.contractType || "service"];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{t.title}</CardTitle>
//         <p className="text-sm text-gray-600">{t.subtitle}</p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold">{t.contractType}</h3>
//           <p>{contractData.contractType}</p>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold">{t.language}</h3>
//           <p>{contractData.agreementLanguage === "en" ? "English" : "Amharic"}</p>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold">{t.description}</h3>
//           <p>{contractData.description}</p>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold">{t.parties}</h3>
//           {contractData.parties?.map((party, index) => (
//             <div key={index} className="mt-2">
//               <p className="font-medium">{partyLabels[index]}</p>
//               <p>{t.fullName}: {party.fullName}</p>
//               <p>{t.phone}: {party.phone}</p>
//               <p>{t.email}: {party.email}</p>
//             </div>
//           ))}
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold">{t.commonDetails}</h3>
//           <p>{t.location}: {contractData.commonDetails?.location}</p>
//           <p>{t.totalAmount}: {contractData.commonDetails?.totalAmount} {contractData.commonDetails?.currency}</p>
//           <p>{t.startDate}: {contractData.commonDetails?.startDate}</p>
//           <p>{t.endDate}: {contractData.commonDetails?.endDate}</p>
//           <p>{t.dueDates}: {contractData.commonDetails?.dueDates?.join(", ")}</p>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold">{t.specificDetails}</h3>
//           {contractData.contractType === "service" && (
//             <>
//               <p>{t.servicesDescription}: {contractData.specificDetails?.servicesDescription}</p>
//               <p>{t.milestones}:</p>
//               {contractData.specificDetails?.milestones?.map((m, index) => (
//                 <div key={index}>
//                   <p>{t.milestoneDescription}: {m.description}</p>
//                   <p>{t.milestoneDate}: {m.date}</p>
//                 </div>
//               ))}
//               <p>{t.revisions}: {contractData.specificDetails?.revisions}</p>
//             </>
//           )}
//           {contractData.contractType === "goods" && (
//             <>
//               <p>{t.goodsTitle}:</p>
//               {contractData.specificDetails?.items?.map((item, index) => (
//                 <div key={index}>
//                   <p>{t.itemDescription}: {item.description}</p>
//                   <p>{t.quantity}: {item.quantity}</p>
//                   <p>{t.unitPrice}: {item.unitPrice}</p>
//                 </div>
//               ))}
//               <p>{t.deliveryTerms}: {contractData.specificDetails?.deliveryTerms}</p>
//             </>
//           )}
//           {contractData.contractType === "loan" && (
//             <>
//               <p>{t.principalAmount}: {contractData.specificDetails?.principalAmount}</p>
//               <p>{t.installments}:</p>
//               {contractData.specificDetails?.installments?.map((i, index) => (
//                 <div key={index}>
//                   <p>{t.installmentAmount}: {i.amount}</p>
//                   <p>{t.installmentDueDate}: {i.dueDate}</p>
//                 </div>
//               ))}
//               <p>{t.lateFeePercentage}: {contractData.specificDetails?.lateFeePercentage}%</p>
//             </>
//           )}
//           {contractData.contractType === "nda" && (
//             <>
//               <p>{t.effectiveDate}: {contractData.specificDetails?.effectiveDate}</p>
//               <p>{t.confidentialityPeriod}: {contractData.specificDetails?.confidentialityPeriod}</p>
//               <p>{t.purpose}: {contractData.specificDetails?.purpose}</p>
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }