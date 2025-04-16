"use client";

import { Grid, Container, Typography } from "@mui/material";
import MyAppBar from "@/components/Appbar";
import DateRangePicker from "@/components/DateRangePicker";

export default function Page() {
  return (
    <div>
      <MyAppBar />
      <Container maxWidth="md">
        <Grid container justifyContent="center" mt={8}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              📅 เลือกช่วงวันที่ที่ต้องการเช่ารถ
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <DateRangePicker />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
