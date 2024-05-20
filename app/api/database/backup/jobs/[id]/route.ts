import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const router = RouterIndex.getInstance();

export async function GET(request: Request, context: { params: any }) {
  try {
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
    const result = await router.databaseBackupController.getJobById({
      id: context?.params?.id,
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
