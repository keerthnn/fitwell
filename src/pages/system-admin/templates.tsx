import { Archive, Delete, MoreVert, Restore } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import {
  adminAddCatalogTemplate,
  adminDeleteTemplate,
  adminGetTemplates,
  adminSetTemplateArchived,
} from "fitness/utils/spec";
import { AdminTemplate } from "fitness/utils/types";
import {
  getWorkoutTemplateImageSource,
  workoutTemplateCatalog,
} from "fitness/utils/workoutTemplateCatalog";
import { useCallback, useEffect, useState } from "react";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("ALL");
  const [archived, setArchived] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<AdminTemplate | null>(null);
  const [catalogSlugs, setCatalogSlugs] = useState<Set<string>>(new Set());
  const [catalogStatus, setCatalogStatus] = useState<
    "ALL" | "TO_ADD" | "ADDED"
  >("ALL");
  const [addingCatalogSlug, setAddingCatalogSlug] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [filteredTemplates, catalogTemplates] = await Promise.all([
        adminGetTemplates({
          search: search || undefined,
          visibility: visibility === "ALL" ? undefined : visibility,
          archived: archived === "ALL" ? undefined : archived,
        }),
        adminGetTemplates({ catalogOnly: "true" }),
      ]);
      setTemplates(filteredTemplates);
      setCatalogSlugs(
        new Set(
          catalogTemplates.flatMap((template) =>
            template.catalogSlug ? [template.catalogSlug] : [],
          ),
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [search, visibility, archived]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function toggleArchive(template: AdminTemplate) {
    const action = template.isArchived ? "restore" : "archive";
    if (
      !confirm(
        `${action === "archive" ? "Archive" : "Restore"} “${template.title}”?`,
      )
    )
      return;
    await adminSetTemplateArchived(template.id, !template.isArchived);
    await load();
  }

  async function remove(template: AdminTemplate) {
    if (
      !confirm(
        `Permanently delete “${template.title}”? Workouts created from it will be preserved, but this cannot be undone.`,
      )
    )
      return;
    await adminDeleteTemplate(template.id);
    await load();
  }

  async function addCatalogTemplate(slug: string) {
    setAddingCatalogSlug(slug);
    try {
      await adminAddCatalogTemplate(slug);
      await load();
    } catch (error) {
      console.error("Failed to add catalog template:", error);
      alert(
        "Could not add this template. Seed or add its required exercises first.",
      );
    } finally {
      setAddingCatalogSlug(null);
    }
  }

  const visibleCatalogTemplates = workoutTemplateCatalog.filter((template) => {
    const isAdded = catalogSlugs.has(template.slug);
    return (
      catalogStatus === "ALL" ||
      (catalogStatus === "ADDED" && isAdded) ||
      (catalogStatus === "TO_ADD" && !isAdded)
    );
  });

  const openActions = (
    event: React.MouseEvent<HTMLElement>,
    template: AdminTemplate,
  ) => {
    setAnchor(event.currentTarget);
    setSelected(template);
  };
  const closeActions = () => {
    setAnchor(null);
    setSelected(null);
  };

  return (
    <AdminPageGuard>
      <AdminLayout>
        <Box sx={{ py: 4 }}>
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Templates
                </Typography>
                <Typography color="text.secondary">
                  Add FitWell routines and manage every workout template.
                </Typography>
              </Box>
              <Paper sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Workout Template Catalog
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add professionally structured routines to the public
                      template library.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${catalogSlugs.size} of ${workoutTemplateCatalog.length} added`}
                    color="primary"
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  mb={2}
                >
                  <Button
                    size="small"
                    variant={catalogStatus === "ALL" ? "contained" : "outlined"}
                    onClick={() => setCatalogStatus("ALL")}
                  >
                    All ({workoutTemplateCatalog.length})
                  </Button>
                  <Button
                    size="small"
                    variant={
                      catalogStatus === "TO_ADD" ? "contained" : "outlined"
                    }
                    onClick={() => setCatalogStatus("TO_ADD")}
                  >
                    To Add ({workoutTemplateCatalog.length - catalogSlugs.size})
                  </Button>
                  <Button
                    size="small"
                    variant={
                      catalogStatus === "ADDED" ? "contained" : "outlined"
                    }
                    onClick={() => setCatalogStatus("ADDED")}
                  >
                    Added ({catalogSlugs.size})
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {visibleCatalogTemplates.map((template) => {
                    const isAdded = catalogSlugs.has(template.slug);
                    const isAdding = addingCatalogSlug === template.slug;
                    return (
                      <Paper
                        key={template.slug}
                        variant="outlined"
                        sx={{ p: 2 }}
                      >
                        <Stack spacing={1.5} height="100%">
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={getWorkoutTemplateImageSource(template.slug)}
                              alt=""
                              aria-hidden="true"
                              sx={{
                                width: 52,
                                height: 52,
                                objectFit: "contain",
                                flexShrink: 0,
                              }}
                            />
                            <Typography fontWeight={700}>
                              {template.title}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ flex: 1 }}
                          >
                            {template.description}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                          >
                            <Chip
                              size="small"
                              label={`${template.exercises.length} exercises`}
                            />
                            <Chip
                              size="small"
                              label={`${template.estimatedDurationM} min`}
                            />
                            <Chip size="small" label={template.difficulty} />
                          </Stack>
                          <Button
                            variant={isAdded ? "outlined" : "contained"}
                            disabled={isAdded || isAdding}
                            onClick={() =>
                              void addCatalogTemplate(template.slug)
                            }
                          >
                            {isAdded
                              ? "Added"
                              : isAdding
                                ? "Adding…"
                                : "Add Template"}
                          </Button>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </Paper>
              <Paper sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    label="Search title, owner, or email"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <TextField
                    select
                    label="Visibility"
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value)}
                    sx={{ minWidth: 180 }}
                  >
                    {["ALL", "PRIVATE", "UNLISTED", "PUBLIC"].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Status"
                    value={archived}
                    onChange={(event) => setArchived(event.target.value)}
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="ALL">ALL</MenuItem>
                    <MenuItem value="false">ACTIVE</MenuItem>
                    <MenuItem value="true">ARCHIVED</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearch("");
                      setVisibility("ALL");
                      setArchived("ALL");
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
              <Typography color="text.secondary">
                {loading
                  ? "Loading templates…"
                  : `${templates.length} template${templates.length === 1 ? "" : "s"}`}
              </Typography>
              <Paper sx={{ overflow: "hidden" }}>
                <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
                  <Stack spacing={2}>
                    {templates.map((template) => (
                      <Paper variant="outlined" key={template.id} sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography fontWeight={700}>
                              {template.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.owner.name || "Unnamed user"} ·{" "}
                              {template.owner.email}
                            </Typography>
                            <Stack direction="row" gap={1} mt={1}>
                              <Chip size="small" label={template.visibility} />
                              <Chip
                                size="small"
                                color={
                                  template.isArchived ? "warning" : "success"
                                }
                                label={
                                  template.isArchived ? "Archived" : "Active"
                                }
                              />
                            </Stack>
                            <Typography variant="body2" mt={1}>
                              {template.exerciseCount} exercises ·{" "}
                              {template.useCount} uses · {template.copyCount}{" "}
                              copies
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={(event) => openActions(event, template)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
                <Table sx={{ display: { xs: "none", md: "table" } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Template</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Visibility</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Exercises</TableCell>
                      <TableCell>Uses</TableCell>
                      <TableCell>Copies</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id} hover>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {template.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.difficulty}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {template.owner.name || "—"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.owner.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={template.visibility} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={template.isArchived ? "warning" : "success"}
                            label={template.isArchived ? "Archived" : "Active"}
                          />
                        </TableCell>
                        <TableCell>{template.exerciseCount}</TableCell>
                        <TableCell>{template.useCount}</TableCell>
                        <TableCell>{template.copyCount}</TableCell>
                        <TableCell>
                          {new Date(template.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Template actions">
                            <IconButton
                              onClick={(event) => openActions(event, template)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!loading && templates.length === 0 && (
                  <Box p={5} textAlign="center">
                    <Typography color="text.secondary">
                      No templates match these filters.
                    </Typography>
                  </Box>
                )}
              </Paper>
              <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={closeActions}
              >
                {selected && (
                  <>
                    <MenuItem
                      onClick={() => {
                        const value = selected;
                        closeActions();
                        void toggleArchive(value);
                      }}
                    >
                      {selected.isArchived ? (
                        <Restore sx={{ mr: 1 }} />
                      ) : (
                        <Archive sx={{ mr: 1 }} />
                      )}
                      {selected.isArchived ? "Restore" : "Archive"}
                    </MenuItem>
                    <MenuItem
                      sx={{ color: "error.main" }}
                      onClick={() => {
                        const value = selected;
                        closeActions();
                        void remove(value);
                      }}
                    >
                      <Delete sx={{ mr: 1 }} />
                      Delete permanently
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Stack>
          </Container>
        </Box>
      </AdminLayout>
    </AdminPageGuard>
  );
}
