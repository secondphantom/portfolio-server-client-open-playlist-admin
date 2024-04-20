import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { CategoryIdCard } from "../_components/category-id-card";
import { Metadata } from "next";
import { ResponseCategoryGetById } from "@/server/spec/category/category.responses";

export const metadata: Metadata = {
  title: "Category",
};

const getPageData = async (params: any) => {
  const categoryData = await fetch(
    `${process.env.API_SERVER_HOST}/api/categories/${params.id}`,
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
      return body as ResponseBody<ResponseCategoryGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { categoryData };
};

const Page = async ({ params }: { params: any }) => {
  const { categoryData } = await getPageData(params);

  if (!categoryData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <CategoryIdCard categoryData={categoryData.data} />
      </div>
    </div>
  );
};

export default Page;
