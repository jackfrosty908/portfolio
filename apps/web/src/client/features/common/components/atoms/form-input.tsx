import type { JSX } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/client/features/common/components/ui/form';
import { Input } from '@/client/features/common/components/ui/input';

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  type?: string;
  state?: {
    errors?: Partial<Record<FieldPath<TFieldValues>, string[]>>;
  };
  labelSuffix?: React.ReactNode;
}

const FormInput = <TFieldValues extends FieldValues = FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  state,
  labelSuffix,
}: FormInputProps<TFieldValues>): JSX.Element => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            <FormLabel>{label}</FormLabel>
            {labelSuffix}
          </div>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
          {state?.errors?.[name] && (
            <p className="text-red-500 text-sm">{state.errors[name]?.[0]}</p>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
