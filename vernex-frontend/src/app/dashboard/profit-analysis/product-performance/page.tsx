import { PageHeader } from "@/components/layout/PageHeader";
import { ProductPerformanceScreen } from "@/modules/shared-core/ManagementScreens";

export default function ProductPerformancePage() {
  return (
    <>
      <PageHeader title="Product Performance" breadcrumbs={["Profit Analysis", "Product Performance"]} />
      <ProductPerformanceScreen />
    </>
  );
}
