import { NextResponse } from "next/server";
import { generateGiftIdea } from "../../../services/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await generateGiftIdea(body.prompt);

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}