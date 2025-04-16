// components/DateRangePicker.js
"use client";

import { useState } from "react";
import { TextField, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DateRangePicker() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("กรุณาเลือกวันเริ่มต้นและวันสิ้นสุด");
      return;
    }

    router.push(`/rent/select-car?start=${startDate}&end=${endDate}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={5}>
        <TextField
          type="date"
          label="วันเริ่มต้น"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          type="date"
          label="วันสิ้นสุด"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          ถัดไป ➡
        </Button>
      </Box>
    </form>
  );
}
