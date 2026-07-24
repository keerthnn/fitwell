import { TextField } from "@mui/material";

export default function SearchInput({
  value,
  onChange,
  label = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputProps={{ maxLength: 120 }}
    />
  );
}
