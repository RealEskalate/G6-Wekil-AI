// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { ContractData, Language } from "@/components/wizard/ContractWizard";

// interface FinalPreviewProps {
//   currentLanguage: Language;
//   contractData: ContractData;
// }

// export default function FinalPreview({ currentLanguage, contractData }: FinalPreviewProps) {
//   const t = {
//     en: {
//       title: "Final Preview",
//       subtitle: "Review the final contract before creation",
//     },
//     am: {
//       title: "ፍጻሜ ቅድመ እይታ",
//       subtitle: "ውሉን ከመፍጠርዎ በፊት ይገምግሙ",
//     },
//   }[currentLanguage];

//   // Placeholder for final contract rendering
//   const finalContent = JSON.stringify(contractData, null, 2); // Replace with actual rendering

//   return (
//     <Card className="max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>{t.title}</CardTitle>
//         <p className="text-sm text-gray-600">{t.subtitle}</p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="border p-4 rounded-md">
//           <pre>{finalContent}</pre>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }