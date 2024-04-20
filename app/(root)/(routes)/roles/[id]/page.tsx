import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { RoleIdCard } from "../_components/role-id-card";
import { Metadata } from "next";
import { ResponseRoleGetById } from "@/server/spec/role/role.responses";

export const metadata: Metadata = {
  title: "Role",
};

const getPageData = async (params: any) => {
  const roleData = await fetch(
    `${process.env.API_SERVER_HOST}/api/roles/${params.id}`,
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
      return body as ResponseBody<ResponseRoleGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { roleData };
};

const Page = async ({ params }: { params: any }) => {
  const { roleData } = await getPageData(params);

  if (!roleData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Roles", href: "/roles" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <RoleIdCard roleData={roleData.data} />
      </div>
    </div>
  );
};

export default Page;
