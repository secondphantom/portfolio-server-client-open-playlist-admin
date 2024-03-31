import { RouterIndex } from "@/server";
import { NextResponse } from "next/server";

const router = RouterIndex.getInstance();

export async function POST(request: Request, context: { params: any }) {
  try {
    const body = await request.json();
    const result = await router.authController.signIn(body);
    return RouterIndex.createJsonResponse(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
