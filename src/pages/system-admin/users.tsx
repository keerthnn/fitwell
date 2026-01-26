import {
  Box,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { adminGetUsers } from "fitness/utils/spec";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
  adminAccess: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    adminGetUsers().then(setUsers);
  }, []);

  return (
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
              <Table>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </AdminLayout>
  );
}
