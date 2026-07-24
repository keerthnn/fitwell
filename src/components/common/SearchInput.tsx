import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

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
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                edge="end"
                onClick={() => onChange("")}
                size="small"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
