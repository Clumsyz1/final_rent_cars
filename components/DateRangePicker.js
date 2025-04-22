"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { TextField, Button, Grid, Typography } from "@mui/material";

export default function DateRangePicker() {
  const [startDate, setStartDate] = useState(""); // สถานะสำหรับวันที่เริ่มต้น
  const [endDate, setEndDate] = useState(""); // สถานะสำหรับวันที่สิ้นสุด
  const router = useRouter(); // ใช้ router สำหรับนำทางไปยังหน้าอื่น

  // ฟังก์ชันที่ใช้ตรวจสอบและนำทางเมื่อผู้ใช้คลิกปุ่มค้นหารถ
  const handleNext = () => {
    if (!startDate || !endDate) {
      alert("กรุณาเลือกวันเริ่มต้นและวันสิ้นสุดการเช่ารถ"); // แจ้งเตือนหากไม่ได้เลือกวันที่
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนทำการเช่ารถ"); // แจ้งเตือนหากผู้ใช้ไม่ได้เข้าสู่ระบบ
        router.push("/auth/sign-in"); // นำทางไปยังหน้าล็อกอิน
      } else {
        // นำทางไปยังหน้าค้นหารถพร้อมส่งข้อมูลวันเริ่มและวันสิ้นสุด
        router.push(`/rent?start=${startDate}&end=${endDate}`);
      }
    });
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {/* ส่วนหัวข้อความ "เลือกวันที่เช่ารถ" */}
      <Grid item xs={12}>
        <Typography variant="h6" align="center" gutterBottom>
          เลือกวันที่เช่ารถ
        </Typography>
      </Grid>

      {/* ช่องกรอกวันที่เริ่มเช่า */}
      <Grid item xs={6}>
        <TextField
          label="วันที่เริ่มเช่า"
          type="date"
          value={startDate} // ค่าเริ่มต้นจากสถานะ startDate
          onChange={(e) => setStartDate(e.target.value)} // อัพเดตค่า startDate เมื่อมีการเปลี่ยนแปลง
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* ช่องกรอกวันที่สิ้นสุด */}
      <Grid item xs={6}>
        <TextField
          label="วันที่สิ้นสุด"
          type="date"
          value={endDate} // ค่าเริ่มต้นจากสถานะ endDate
          onChange={(e) => setEndDate(e.target.value)} // อัพเดตค่า endDate เมื่อมีการเปลี่ยนแปลง
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* ปุ่มค้นหารถให้เช่า */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleNext} // เรียกฟังก์ชัน handleNext เมื่อคลิก
          sx={{
            background:
              "linear-gradient(to bottom,rgb(0, 53, 128),rgb(27, 96, 193))", // สีพื้นหลังปุ่ม
            borderRadius: "30px", // ขอบปุ่มกลม
            px: 5,
            py: 1.5,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#2c3e91", // สีเมื่อเอาเมาส์ไปเหนือปุ่ม
            },
          }}
        >
          ค้นหารถให้เช่า
        </Button>
      </Grid>
    </Grid>
  );
}
