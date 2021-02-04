export interface FormValueChange<Value> {
  id: string,
  value: Value
}

export type FormValueChangeHandler = (updates: FormValueChange<any>[]) => void;
