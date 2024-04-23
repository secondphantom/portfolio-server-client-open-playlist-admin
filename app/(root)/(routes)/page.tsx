import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default async function Page() {
  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb breadcrumbs={[{ label: "Home", href: "/" }]} />
      </div>
    </div>
  );
}
