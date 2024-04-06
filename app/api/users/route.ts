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
    const auth = await router.verifyAuth(
      cookieStore.get("sessionKey")?.value as any
    );

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const result = await router.userController.getUserListByQuery({
      ...(searchParamsObj as any),
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
