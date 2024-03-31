import { RouterIndex } from "@/server";
import { headers } from "next/headers";
import { NextResponse, userAgent } from "next/server";

const router = RouterIndex.getInstance();

export async function POST(request: Request, context: { params: any }) {
  try {
    const body = await request.json();
    const { device, ua } = userAgent(request);
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for");

    const result = await router.authController.verifyOtp({
      email: body.email,
      otpCode: body.otpCode,
      data: {
        ip: ip as any,
        device: device,
        userAgent: ua,
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
