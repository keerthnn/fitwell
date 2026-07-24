import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AnalyticsPoint } from "fitness/utils/types";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesDefinition {
  key: string;
  label: string;
  color: string;
}

export function AdminAnalyticsChart({
  title,
  data,
  series,
  variant = "line",
}: {
  title: string;
  data: AnalyticsPoint[];
  series: SeriesDefinition[];
  variant?: "line" | "bar";
}) {
  const [showTable, setShowTable] = useState(false);
  const Chart = variant === "bar" ? BarChart : LineChart;
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <Typography variant="h6">{title}</Typography>
        <Button size="small" onClick={() => setShowTable((value) => !value)}>
          {showTable ? "Hide data" : "Show data"}
        </Button>
      </Box>
      {data.length === 0 ? (
        <Typography color="text.secondary">No data for this period.</Typography>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            height: { xs: 250, sm: 300 },
            overflow: "hidden",
          }}
          aria-hidden={showTable}
        >
          <ResponsiveContainer width="99%" height="100%">
            <Chart
              data={data}
              margin={{ left: 0, right: 12, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" minTickGap={24} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {series.map((item) =>
                variant === "bar" ? (
                  <Bar
                    key={item.key}
                    dataKey={item.key}
                    name={item.label}
                    fill={item.color}
                    radius={[4, 4, 0, 0]}
                  />
                ) : (
                  <Line
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    name={item.label}
                    stroke={item.color}
                    strokeWidth={2}
                    dot={data.length <= 31}
                  />
                ),
              )}
            </Chart>
          </ResponsiveContainer>
        </Box>
      )}
      {showTable && (
        <Box sx={{ mt: 2, maxWidth: "100%" }}>
          <Stack
            spacing={1}
            sx={{ display: { xs: "flex", sm: "none" } }}
            aria-label={`${title} data`}
          >
            {data.map((point) => (
              <Paper key={point.bucket} variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="body2" fontWeight={700} mb={1}>
                  {point.label}
                </Typography>
                {series.map((item) => (
                  <Box
                    key={item.key}
                    display="flex"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {point[item.key]}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            ))}
          </Stack>
          <Table
            size="small"
            aria-label={`${title} data`}
            sx={{
              display: { xs: "none", sm: "table" },
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                {series.map((item) => (
                  <TableCell key={item.key} align="right">
                    {item.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((point) => (
                <TableRow key={point.bucket}>
                  <TableCell sx={{ overflowWrap: "anywhere" }}>
                    {point.label}
                  </TableCell>
                  {series.map((item) => (
                    <TableCell
                      key={item.key}
                      align="right"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {point[item.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
