import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const router = RouterIndex.getInstance();

export async function POST(request: Request, context: { params: any }) {
  try {
    const cookieStore = cookies();
    const result = await router.authController.signOut({
      sessionKey: cookieStore.get("sessionKey")?.value as any,
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
