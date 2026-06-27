import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/modals/FormModal";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onCancel,
  onConfirm
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <FormModal open={open} title={title} description={description} onClose={onCancel}>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </FormModal>
  );
}
