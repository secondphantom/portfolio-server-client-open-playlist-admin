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
    const result = await router.noticeController.getNoticeById({
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

export async function PATCH(request: Request, context: { params: any }) {
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
    const body = await request.json();
    const params = context.params;
    const result = await router.noticeController.updateNoticeById({
      ...body,
      id: params.id,
    });
    return RouterIndex.createJsonResponse(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
