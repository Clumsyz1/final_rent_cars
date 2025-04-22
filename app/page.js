"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Fade,
} from "@mui/material";
import MyAppBar from "@/components/Appbar"; // แถบเมนูด้านบน
import DateRangePicker from "@/components/DateRangePicker"; // คอมโพเนนต์เลือกช่วงวันที่
import { useEffect, useState } from "react";
import styles from "./page.module.css"; // นำเข้า CSS ที่ใช้ในหน้า

export default function Page() {
  const [loaded, setLoaded] = useState(false); // ใช้สถานะในการตรวจสอบว่าโหลดเสร็จแล้วหรือยัง

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300); // ใช้ timer เพื่อดีเลย์การเปลี่ยนแปลงสถานะ
    return () => clearTimeout(timer); // ลบ timer เมื่อคอมโพเนนต์ถูกทำลาย
  }, []);

  return (
    <Box className={styles.pageContainer}>
      {" "}
      {/* กล่องหลักที่ครอบทุกอย่าง */}
      <MyAppBar /> {/* แสดงแถบเมนูด้านบน */}
      <Fade in={loaded} timeout={700}>
        {" "}
        {/* การแสดงผลที่มีเอฟเฟกต์การเฟด */}
        <Box sx={{ flex: 1, pt: { xs: 8, sm: 10 }, pb: 4 }}>
          {" "}
          {/* คอนเทนเนอร์หลัก */}
          {/* Hero + Date Picker Section */}
          <Box className={styles.heroContainer}>
            {" "}
            {/* คอนเทนเนอร์ส่วน Hero */}
            <Typography className={styles.title}>
              Rent Car Rent Jai
            </Typography>{" "}
            {/* ชื่อบริการ */}
            <Typography className={styles.subtitle}>
              บริการเช่ารถทั่วไทย สะดวก ราคายุติธรรม พร้อมให้บริการ 24 ชม.
            </Typography>
            <Box mt={4}>
              <DateRangePicker /> {/* คอมโพเนนต์เลือกช่วงวันที่ */}
            </Box>
          </Box>
          {/* Features Section */}
          <Container maxWidth="lg" className={styles.featuresContainer}>
            {" "}
            {/* คอนเทนเนอร์สำหรับฟีเจอร์ */}
            <Paper elevation={0} className={styles.featuresPaper}>
              {" "}
              {/* กระดาษสำหรับแสดงฟีเจอร์ */}
              <Typography className={styles.featuresTitle}>
                ทำไมถึงต้อง Rent Car Rent Jai?
              </Typography>
              <Grid container spacing={2}>
                {" "}
                {/* Grid สำหรับแสดงฟีเจอร์ */}
                {[
                  "🚗 รถใหม่ หลากหลายรุ่น",
                  "🧾 ระบบจองใช้งานง่าย",
                  "💵 ไม่มีค่าใช้จ่ายแอบแฝง",
                  "🧑‍🔧 บริการช่วยเหลือตลอด 24 ชม.",
                  "📍 มีสาขาทั่วประเทศ",
                  "🛡️ ประกันภัยครบทุกคัน",
                ].map((text, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    {" "}
                    {/* แสดงฟีเจอร์แต่ละรายการ */}
                    <Typography className={styles.featureItem}>
                      {text}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Fade>
      {/* Footer */}
      <Box component="footer" className={styles.footer}>
        {" "}
        {/* ส่วนท้ายของหน้าเว็บ */}
        <Typography className={styles.footerText}>
          © {new Date().getFullYear()} Rent Car Rent Jai — All rights reserved.
        </Typography>{" "}
        {/* ข้อความสิทธิ์การใช้งาน */}
      </Box>
    </Box>
  );
}
