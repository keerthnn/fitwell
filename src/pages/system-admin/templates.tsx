import { Archive, Delete, MoreVert, Restore } from "@mui/icons-material";
import {
  Box, Button, Chip, Container, IconButton, Menu, MenuItem, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import { adminDeleteTemplate, adminGetTemplates, adminSetTemplateArchived } from "fitness/utils/spec";
import { AdminTemplate } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("ALL");
  const [archived, setArchived] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<AdminTemplate | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTemplates(await adminGetTemplates({
        search: search || undefined,
        visibility: visibility === "ALL" ? undefined : visibility,
        archived: archived === "ALL" ? undefined : archived,
      }));
    } finally { setLoading(false); }
  }, [search, visibility, archived]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(timer); }, [load]);

  async function toggleArchive(template: AdminTemplate) {
    const action = template.isArchived ? "restore" : "archive";
    if (!confirm(`${action === "archive" ? "Archive" : "Restore"} “${template.title}”?`)) return;
    await adminSetTemplateArchived(template.id, !template.isArchived);
    await load();
  }

  async function remove(template: AdminTemplate) {
    if (!confirm(`Permanently delete “${template.title}”? Workouts created from it will be preserved, but this cannot be undone.`)) return;
    await adminDeleteTemplate(template.id);
    await load();
  }

  const openActions = (event: React.MouseEvent<HTMLElement>, template: AdminTemplate) => { setAnchor(event.currentTarget); setSelected(template); };
  const closeActions = () => { setAnchor(null); setSelected(null); };

  return <AdminPageGuard><AdminLayout><Box sx={{ py: 4 }}><Container maxWidth="xl"><Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={700}>Templates</Typography><Typography color="text.secondary">Review and manage every user-created workout template.</Typography></Box>
    <Paper sx={{ p: 2 }}><Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <TextField label="Search title, owner, or email" value={search} onChange={(event) => setSearch(event.target.value)} />
      <TextField select label="Visibility" value={visibility} onChange={(event) => setVisibility(event.target.value)} sx={{ minWidth: 180 }}>{["ALL", "PRIVATE", "UNLISTED", "PUBLIC"].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
      <TextField select label="Status" value={archived} onChange={(event) => setArchived(event.target.value)} sx={{ minWidth: 180 }}><MenuItem value="ALL">ALL</MenuItem><MenuItem value="false">ACTIVE</MenuItem><MenuItem value="true">ARCHIVED</MenuItem></TextField>
      <Button variant="outlined" onClick={() => { setSearch(""); setVisibility("ALL"); setArchived("ALL"); }}>Reset</Button>
    </Stack></Paper>
    <Typography color="text.secondary">{loading ? "Loading templates…" : `${templates.length} template${templates.length === 1 ? "" : "s"}`}</Typography>
    <Paper sx={{ overflow: "hidden" }}>
      <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}><Stack spacing={2}>{templates.map((template) => <Paper variant="outlined" key={template.id} sx={{ p: 2 }}><Stack direction="row" justifyContent="space-between"><Box><Typography fontWeight={700}>{template.title}</Typography><Typography variant="body2" color="text.secondary">{template.owner.name || "Unnamed user"} · {template.owner.email}</Typography><Stack direction="row" gap={1} mt={1}><Chip size="small" label={template.visibility} /><Chip size="small" color={template.isArchived ? "warning" : "success"} label={template.isArchived ? "Archived" : "Active"} /></Stack><Typography variant="body2" mt={1}>{template.exerciseCount} exercises · {template.useCount} uses · {template.copyCount} copies</Typography></Box><IconButton onClick={(event) => openActions(event, template)}><MoreVert /></IconButton></Stack></Paper>)}</Stack></Box>
      <Table sx={{ display: { xs: "none", md: "table" } }}><TableHead><TableRow><TableCell>Template</TableCell><TableCell>Owner</TableCell><TableCell>Visibility</TableCell><TableCell>Status</TableCell><TableCell>Exercises</TableCell><TableCell>Uses</TableCell><TableCell>Copies</TableCell><TableCell>Updated</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{templates.map((template) => <TableRow key={template.id} hover><TableCell><Typography fontWeight={600}>{template.title}</Typography><Typography variant="caption" color="text.secondary">{template.difficulty}</Typography></TableCell><TableCell><Typography variant="body2">{template.owner.name || "—"}</Typography><Typography variant="caption" color="text.secondary">{template.owner.email}</Typography></TableCell><TableCell><Chip size="small" label={template.visibility} /></TableCell><TableCell><Chip size="small" color={template.isArchived ? "warning" : "success"} label={template.isArchived ? "Archived" : "Active"} /></TableCell><TableCell>{template.exerciseCount}</TableCell><TableCell>{template.useCount}</TableCell><TableCell>{template.copyCount}</TableCell><TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell><TableCell align="right"><Tooltip title="Template actions"><IconButton onClick={(event) => openActions(event, template)}><MoreVert /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody></Table>
      {!loading && templates.length === 0 && <Box p={5} textAlign="center"><Typography color="text.secondary">No templates match these filters.</Typography></Box>}
    </Paper>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeActions}>{selected && <><MenuItem onClick={() => { const value = selected; closeActions(); void toggleArchive(value); }}>{selected.isArchived ? <Restore sx={{ mr: 1 }} /> : <Archive sx={{ mr: 1 }} />}{selected.isArchived ? "Restore" : "Archive"}</MenuItem><MenuItem sx={{ color: "error.main" }} onClick={() => { const value = selected; closeActions(); void remove(value); }}><Delete sx={{ mr: 1 }} />Delete permanently</MenuItem></>}</Menu>
  </Stack></Container></Box></AdminLayout></AdminPageGuard>;
}
