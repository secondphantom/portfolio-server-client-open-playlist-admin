import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { ChannelIdCard } from "../_components/channel-id-card";
import { ResponseChannelGetById } from "@/server/spec/channel/channel.responses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channel",
};

const getPageData = async (params: any) => {
  const channelData = await fetch(
    `${process.env.API_SERVER_HOST}/api/channels/${params.id}`,
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
      return body as ResponseBody<ResponseChannelGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { channelData };
};

const Page = async ({ params }: { params: any }) => {
  const { channelData } = await getPageData(params);

  if (!channelData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Channels", href: "/channels" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <ChannelIdCard channelData={channelData.data} />
      </div>
    </div>
  );
};

export default Page;
