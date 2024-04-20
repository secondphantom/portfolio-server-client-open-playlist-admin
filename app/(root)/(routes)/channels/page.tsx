import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import ChannelTable from "./_components/channel-table";

import { ChannelHeader } from "./_components/channel-header";
import { ResponseUserGetListByQuery } from "@/server/spec/user/user.responses";
import { ResponseCourseGetListByQuery } from "@/server/spec/course/course.responses";
import { ResponseChannelGetListByQuery } from "@/server/spec/channel/channel.responses";

export const metadata: Metadata = {
  title: "Channels",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const channelListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/channels?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseChannelGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { channelListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { channelListData } = await getPageData(searchParams as any);

  if (!channelListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Channels" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <ChannelHeader />
      </div>
      <ChannelTable
        searchParams={searchParams}
        channelListData={channelListData.data}
      />
    </div>
  );
};

export default Page;
