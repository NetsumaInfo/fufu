export type FormStatus = 'idle' | 'success' | 'error';

export type FormErrors<FieldName extends string> = Partial<Record<FieldName, string>>;

export type FormState<FieldName extends string> = {
  status: FormStatus;
  message: string | null;
  errors: FormErrors<FieldName>;
};

export function createInitialFormState<FieldName extends string>(): FormState<FieldName> {
  return {
    status: 'idle',
    message: null,
    errors: {},
  };
}

export type HoneypotField = {
  id: string;
  name: string;
  label: string;
};

export function createHoneypotField(formId: string): HoneypotField {
  const token = `${formId}-notes`;

  return {
    id: `${token}-input`,
    name: `${token}-field`,
    label: 'If you are human, leave this field empty.',
  };
}

export function formDataToObject<FieldName extends string>(
  formData: FormData,
  fields: readonly FieldName[]
): Record<FieldName, string> {
  return fields.reduce((acc, field) => {
    const value = formData.get(field);
    acc[field] = typeof value === 'string' ? value : '';
    return acc;
  }, {} as Record<FieldName, string>);
}
