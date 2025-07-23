import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/features/common/components/ui/form";
import { Input } from "@/client/features/common/components/ui/input";
import type { SignupState } from "@/common/actions/supabase/actions";

interface FormInputProps {
  form: UseFormReturn<any>;
  state: SignupState;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

const FormInput = ({
  form,
  state,
  name,
  label,
  placeholder,
  type = "text",
}: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
          {state?.errors?.[name as keyof SignupState["errors"]] && (
            <p className="text-red-500 text-sm">
              {state.errors[name as keyof SignupState["errors"]]?.[0]}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
