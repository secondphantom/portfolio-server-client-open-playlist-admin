import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const router = RouterIndex.getInstance();

export async function GET(request: NextRequest, context: { params: any }) {
  try {
    const searchParamsObj = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const cookieStore = cookies();
    const session = await router.authController.verifySession({
      sessionId: cookieStore.get("sessionId")?.value as any,
    });
    if (session.getResponse().code !== 200) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const result = await router.healthController.getHealthListByQuery({
      ...searchParamsObj,
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: { params: any }) {
  try {
    const cookieStore = cookies();
    const session = await router.authController.verifySession({
      sessionId: cookieStore.get("sessionId")?.value as any,
    });
    if (session.getResponse().code !== 200) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const result = await router.healthController.createHealth();
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
