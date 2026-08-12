import { MenuItem, TextField } from "@mui/material";
import FilterToolbar from "fitness/components/common/FilterToolbar";
import SearchInput from "fitness/components/common/SearchInput";
import { feedbackCategoryOptions } from "fitness/utils/feedback";

export default function FeedbackFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) {
  return (
    <FilterToolbar>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        label="Search feedback"
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <MenuItem value="">All categories</MenuItem>
        {feedbackCategoryOptions.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        <MenuItem value="OPEN">Open</MenuItem>
        <MenuItem value="RESPONDED">Responded</MenuItem>
        <MenuItem value="CLOSED">Closed</MenuItem>
      </TextField>
    </FilterToolbar>
  );
}
