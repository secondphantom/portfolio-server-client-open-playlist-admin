import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import SessionTable from "./_components/session-table";

import { SessionHeader } from "./_components/session-header";
import { ResponseSessionGetListByQuery } from "@/server/spec/session/session.responses";

export const metadata: Metadata = {
  title: "Sessions",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const sessionListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/sessions?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseSessionGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { sessionListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { sessionListData } = await getPageData(searchParams as any);

  if (!sessionListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sessions" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <SessionHeader />
      </div>
      <SessionTable
        searchParams={searchParams}
        sessionListData={sessionListData.data}
      />
    </div>
  );
};

export default Page;
