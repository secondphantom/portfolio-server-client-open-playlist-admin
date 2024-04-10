import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import HealthTable from "./_components/health-table";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { HealthHeader } from "./_components/health-header";

export const metadata: Metadata = {
  title: "Health",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const healthListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/healths?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseHealthGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { healthListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { healthListData } = await getPageData(searchParams as any);

  if (!healthListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Healths" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <HealthHeader />
      </div>
      <HealthTable
        searchParams={searchParams}
        healthListData={healthListData.data}
      />
    </div>
  );
};

export default Page;
