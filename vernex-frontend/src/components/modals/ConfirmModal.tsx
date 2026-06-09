import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/modals/FormModal";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm"
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
}) {
  return (
    <FormModal open={open} title={title} description={description}>
      <div className="flex justify-end gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">{confirmLabel}</Button>
      </div>
    </FormModal>
  );
}
