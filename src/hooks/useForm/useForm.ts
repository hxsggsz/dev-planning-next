import { useState } from "react";
import { type IForm } from "./useForm.types";

export function useForm<T extends object>({
  initialState,
  validation,
  handleSubmit,
}: IForm<T>) {
  const [inputs, setInputs] = useState(initialState);
  const [error, setError] = useState<T | null>(null);

  const validationValues = (inputs: T) => {
    const errors = validation(inputs);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const checkErrors = Object.values(errors).some((error) => error.length > 0);
    const hasErrors = checkErrors ? errors : null;

    setError(hasErrors);
    return hasErrors;
  };

  return {
    error,
    inputs,
    handleChange: (ev: React.FormEvent<HTMLInputElement>) => {
      const value = ev.currentTarget.value ?? ev.currentTarget.checked;
      const name = ev.currentTarget.name;

      setInputs({
        ...inputs,
        [name]: value,
      });
    },

    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const isErrors = validationValues(inputs);

      if (!isErrors) {
        handleSubmit(inputs, ev);
      }
    },
  };
}
