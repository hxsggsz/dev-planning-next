export interface IForm<T extends object> {
  initialState: T;
  validation: (inputs: T) => T;
  handleSubmit: (inputs: T, ev: React.FormEvent<HTMLFormElement>) => void;
}
