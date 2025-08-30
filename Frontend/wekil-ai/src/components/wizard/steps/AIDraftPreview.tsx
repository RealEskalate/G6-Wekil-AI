// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { ContractData, Language } from "@/components/wizard/ContractWizard";

// interface AIDraftPreviewProps {
//   currentLanguage: Language;
//   contractData: ContractData;
// }

// export default function AIDraftPreview({ currentLanguage, contractData }: AIDraftPreviewProps) {
//   const t = {
//     en: {
//       title: "AI Draft Preview",
//       subtitle: "Review the AI-generated contract draft",
//     },
//     am: {
//       title: "AI ረቂቅ ቅድመ እይታ",
//       subtitle: "በAI የተፈጠረውን የውል ረቂቅ ይገምግሙ",
//     },
//   }[currentLanguage];

//   // Placeholder for AI draft rendering
//   const aiDraftContent = contractData.aiDraft || "AI-generated draft content goes here...";

//   return (
//     <Card className="max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>{t.title}</CardTitle>
//         <p className="text-sm text-gray-600">{t.subtitle}</p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="border p-4 rounded-md">
//           <p>{aiDraftContent}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }