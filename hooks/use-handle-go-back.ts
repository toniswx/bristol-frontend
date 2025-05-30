import { useFormState } from "@/lib/stores/formStore";

export function useGoBackOneFormStep() {
  const form = useFormState();
  return form.setGoBackOneStep();
}
