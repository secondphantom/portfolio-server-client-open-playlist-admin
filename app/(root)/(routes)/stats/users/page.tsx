import { Metadata } from "next";
import * as dateMath from "date-arithmetic";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

import UserStatsChart from "./_components/user-stats-chart";
import { ResponseUserStatGetListByQuery } from "@/server/spec/stat/user/user.stat.responses";
import { UserStatsHeader } from "./_components/user-stats-header";

export const metadata: Metadata = {
  title: "User Stats",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);
  const userStatListData = await fetch(
    `${
      process.env.API_SERVER_HOST
    }/api/stats/users?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseUserStatGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { userStatListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  if (Object.keys(searchParams).length === 0) {
    const urlSearchParams = new URLSearchParams(searchParams);

    const today = new Date();

    if (!urlSearchParams.has("startDate")) {
      const startDate = dateMath
        .add(today, -7, "day")
        .toISOString()
        .substring(0, 10);
      urlSearchParams.set("startDate", startDate);
    }

    if (!urlSearchParams.has("endDate")) {
      const endDate = today.toISOString().substring(0, 10);
      urlSearchParams.set("endDate", endDate);
    }

    if (!urlSearchParams.has("version")) {
      urlSearchParams.set("version", "1");
    }

    redirect(`/stats/users?${urlSearchParams.toString()}`);
  }

  const { userStatListData } = await getPageData(searchParams as any);

  if (!userStatListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Stats" },
            { label: "Users", href: "/stats/users" },
          ]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <UserStatsHeader searchParams={searchParams} />
      </div>
      <UserStatsChart userStatListData={userStatListData.data} />
    </div>
  );
};

export default Page;
