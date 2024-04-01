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
    const auth = session.getResponse().payload.data!;
    const result = await router.sessionController.getSessionListByQuery({
      auth: {
        adminId: auth?.admin.id,
        sessionId: auth?.id,
      },
      query: {
        ...searchParamsObj,
      },
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
