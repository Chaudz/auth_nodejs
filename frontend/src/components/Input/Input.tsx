import { Path, UseFormRegister, FieldValues } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  label: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
};

const Input = <T extends FieldValues>({
  label,
  register,
  required,
}: InputProps<T>) => (
  <>
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "start",
      }}
    >
      <label>{label}</label>
      <input
        style={{ padding: 7, borderRadius: 5, border: "1px solid #ccc" }}
        {...register(label, { required })}
      />
    </div>
  </>
);

export default Input;
