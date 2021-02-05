export interface FormValueChange<Value> {
  id: string,
  value: Value
  source?: string
}

export type FormValueChangeHandler = (updates: FormValueChange<any>[]) => void;
