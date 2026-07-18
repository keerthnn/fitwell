import {
  Box,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import {
  adminDeleteUser,
  adminGetUsers,
  adminSetUserAccess,
} from "fitness/utils/spec";
import { useAuth } from "fitness/components/context";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
  adminAccess: { userId: string } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    setUsers(await adminGetUsers());
  };

  useEffect(() => {
    loadUsers().catch(console.error);
  }, []);

  const setAdminAccess = async (user: AdminUser, isAdmin: boolean) => {
    const message = isAdmin
      ? `Make ${user.email} an admin? They will be able to manage users, exercises, and system data.`
      : `Remove admin access from ${user.email}? They will no longer be able to manage the system.`;

    if (!confirm(message)) return;

    setActionUserId(user.id);
    try {
      await adminSetUserAccess(user.id, isAdmin);
      await loadUsers();
    } catch (error) {
      console.error("Failed to update admin access:", error);
      alert("Failed to update admin access.");
    } finally {
      setActionUserId(null);
    }
  };

  const removeUser = async (user: AdminUser) => {
    if (!confirm(`Remove ${user.email}? This deletes their FitWell account and workout data.`)) {
      return;
    }

    setActionUserId(user.id);
    try {
      await adminDeleteUser(user.id);
      await loadUsers();
    } catch (error) {
      console.error("Failed to remove user:", error);
      alert("Failed to remove user.");
    } finally {
      setActionUserId(null);
    }
  };

  const openUserActions = (
    event: React.MouseEvent<HTMLElement>,
    user: AdminUser,
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const closeUserActions = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const runAdminAction = () => {
    if (!selectedUser) return;
    const user = selectedUser;
    closeUserActions();
    void setAdminAccess(user, !user.adminAccess);
  };

  const runRemoveUser = () => {
    if (!selectedUser) return;
    const user = selectedUser;
    closeUserActions();
    void removeUser(user);
  };

  return (
    <AdminPageGuard>
      <AdminLayout>
        <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Users
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage user accounts and permissions
              </Typography>
            </Box>

            <Paper>
              <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
                <Stack spacing={1}>
                  {users.map((user) => (
                    <Paper key={user.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Box>
                          <Typography fontWeight={600}>{user.email}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.name ?? "No name"} • {user.profile
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : "No profile"}
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={user.adminAccess ? "success.main" : "text.secondary"}
                          >
                            {user.adminAccess ? "Admin" : "Standard user"}
                          </Typography>
                          {user.id === currentUser?.uid ? (
                            <Typography variant="body2" color="text.secondary">
                              Current user
                            </Typography>
                          ) : (
                            <Tooltip title="User actions">
                              <IconButton
                                aria-label={`Actions for ${user.email}`}
                                disabled={actionUserId === user.id}
                                onClick={(event) => openUserActions(event, user)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
              <Table sx={{ display: { xs: "none", md: "table" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Email
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Profile
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Admin
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.name ?? "—"}</TableCell>
                      <TableCell>
                        {u.profile
                          ? `${u.profile.firstName} ${u.profile.lastName}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: u.adminAccess
                              ? "success.main"
                              : "text.secondary",
                            fontWeight: u.adminAccess ? 600 : 400,
                          }}
                        >
                          {u.adminAccess ? "YES" : "NO"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {u.id === currentUser?.uid ? (
                          <Typography variant="body2" color="text.secondary">
                            Current user
                          </Typography>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="User actions">
                              <IconButton
                                size="small"
                                disabled={actionUserId === u.id}
                                aria-label={`Actions for ${u.email}`}
                                onClick={(event) => openUserActions(event, u)}
                            >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Menu
              anchorEl={actionMenuAnchor}
              open={Boolean(actionMenuAnchor && selectedUser)}
              onClose={closeUserActions}
            >
              <MenuItem onClick={runAdminAction}>
                {selectedUser?.adminAccess ? "Remove Admin" : "Make Admin"}
              </MenuItem>
              <MenuItem onClick={runRemoveUser} sx={{ color: "error.main" }}>
                Remove User
              </MenuItem>
            </Menu>
          </Stack>
        </Container>
        </Box>
      </AdminLayout>
    </AdminPageGuard>
  );
}
