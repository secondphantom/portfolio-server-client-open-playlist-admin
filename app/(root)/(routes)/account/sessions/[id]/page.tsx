import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { SessionIdCard } from "../_components/session-id-card";
import { ResponseSessionsGetById } from "@/server/spec/session/session.responses";

export const metadata: Metadata = {
  title: "Session",
};

const getPageData = async (params: any) => {
  const sessionData = await fetch(
    `${process.env.API_SERVER_HOST}/api/sessions/${params.id}`,
    {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  )
    .then(async (res) => {
      if (res.status >= 300) throw new Error();
      const body = await res.json();
      ``;
      return body as ResponseBody<ResponseSessionsGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { sessionData };
};

const Page = async ({ params }: { params: any }) => {
  const { sessionData } = await getPageData(params);

  if (!sessionData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Sessions", href: "/account/sessions" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <SessionIdCard sessionData={sessionData.data} />
      </div>
    </div>
  );
};

export default Page;
