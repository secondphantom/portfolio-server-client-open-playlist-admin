import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import CategoryTable from "./_components/category-table";

import { CategoryHeader } from "./_components/category-header";
import { ResponseRoleGetListByQuery } from "@/server/spec/role/role.responses";
import { ResponseCategoryGetListByQuery } from "@/server/spec/category/category.responses";

export const metadata: Metadata = {
  title: "Roles",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const categoryListData = await fetch(
    `${
      process.env.API_SERVER_HOST
    }/api/categories?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseCategoryGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { categoryListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { categoryListData } = await getPageData(searchParams as any);

  if (!categoryListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <CategoryHeader />
      </div>
      <CategoryTable
        searchParams={searchParams}
        categoryListData={categoryListData.data}
      />
    </div>
  );
};

export default Page;
