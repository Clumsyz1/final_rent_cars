// app/rent/page.js
"use client";

import { Grid } from "@mui/material";
import DateRangePicker from "@/components/DateRangePicker";

export default function RentDatePage() {
  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={12} sm={8} md={6}>
        <DateRangePicker />
      </Grid>
    </Grid>
  );
}
