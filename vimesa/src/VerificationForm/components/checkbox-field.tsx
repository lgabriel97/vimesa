"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

type CheckboxFieldProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  id: string;
};

export function CheckboxField({
  checked,
  onCheckedChange,
  label,
  id,
}: CheckboxFieldProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
      />
      <FieldLabel htmlFor={id} className="font-normal">
        {label}
      </FieldLabel>
    </Field>
  );
}
