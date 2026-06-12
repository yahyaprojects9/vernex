import { PageHeader } from "@/components/layout/PageHeader";
import { ProductPerformanceScreen } from "@/modules/shared-core/ManagementScreens";

export default function ProductPerformancePage() {
  return (
    <>
      <PageHeader title="Product Performance" description="Working menu item CRUD with filtering, export, and dynamic performance records." breadcrumbs={["Profit Analysis", "Product Performance"]} />
      <ProductPerformanceScreen />
    </>
  );
}
