"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { TextField, Button, Grid, Typography } from "@mui/material";

export default function DateRangePicker() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (!startDate || !endDate) {
      alert("กรุณาเลือกวันเริ่มต้นและวันสิ้นสุดการเช่ารถ");
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนทำการเช่ารถ");
        router.push("/auth/sign-in");
      } else {
        router.push(`/rent?start=${startDate}&end=${endDate}`);
      }
    });
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" align="center" gutterBottom>
          เลือกวันที่เช่ารถ
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="วันที่เริ่มเช่า"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="วันที่สิ้นสุด"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleNext}
          sx={{
            background:
              "linear-gradient(to bottom,rgb(0, 53, 128),rgb(27, 96, 193))",
            borderRadius: "30px",
            px: 5,
            py: 1.5,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#2c3e91",
            },
          }}
        >
          ค้นหารถให้เช่า
        </Button>
      </Grid>
    </Grid>
  );
}
