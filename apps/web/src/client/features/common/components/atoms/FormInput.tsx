import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/client/features/common/components/ui/form';
import { Input } from '@/client/features/common/components/ui/input';

interface FormInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  state?: {
    errors?: Record<string, string[]>;
  };
  labelSuffix?: React.ReactNode;
}

const FormInput = ({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  state,
  labelSuffix,
}: FormInputProps) => {
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
