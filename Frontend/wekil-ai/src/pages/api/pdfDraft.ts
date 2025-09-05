import { ContractDraft } from "@/components/ContractPreview/ContractPreview";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const draft: ContractDraft = req.body;
    const externalResponse = await fetch(
      "https://api.craftmypdf.com/v1/create",
      {
        method: "POST",
        headers: {
          "X-API-Key": "cddeMjMzMTE6MjM0NDM6S01qdTE0OHhGN1Q0YTRWVg=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: "8ea77b23fc700f42",
          data: {
            title: draft.title,
            party1: {
              name: draft.party1.name,
              address: draft.party1.address,
              email: draft.party1.email,
              phone: draft.party1.phone,
            },
            party2: {
              name: draft.party2.name,
              address: draft.party2.address,
              email: draft.party2.email,
              phone: draft.party2.phone,
            },
            description: "",
            sections: draft.sections,
            sign1: draft.sign1,
            sign2: draft.sign2,
          },
        }),
      }
    );

    const data = await externalResponse.json();

    if (!data.file) {
      return res.status(422).json({ message: "PDF link missing in response" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
