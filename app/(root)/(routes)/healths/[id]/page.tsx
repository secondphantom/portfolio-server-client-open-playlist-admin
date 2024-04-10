import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrum";
import { ResponseHealthGetById } from "@/server/spec/health/health.responses";
import HealthIdApiTable from "../_components/health-id-api-table";

const getPageData = async (params: any) => {
  const healthData = await fetch(
    `${process.env.API_SERVER_HOST}/api/healths/${params.id}`,
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
      return body as ResponseBody<ResponseHealthGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { healthData };
};

const Page = async ({ params }: { params: any }) => {
  const { healthData } = await getPageData(params);

  if (!healthData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Healths", href: "/healths" },
            { label: params.id },
          ]}
        />
      </div>
      <HealthIdApiTable healthData={healthData.data} />
    </div>
  );
};

export default Page;
