"use client";

import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import MyAppBar from "@/components/Appbar";
import DateRangePicker from "@/components/DateRangePicker";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className={styles.pageContainer}>
      <MyAppBar />
      <marquee className={styles.WingWing} direction="left">
        Login แล้วไปที่หน้าProfile เพื่อกรอกข้อมูลส่วนตัว
      </marquee>
      <Box sx={{ flex: 1, pt: { xs: 8, sm: 10 }, pb: 4 }}>
        <Box className={styles.heroContainer}>
          <Typography className={styles.title}>Rent Car Rent Jai</Typography>
          <Typography className={styles.subtitle}>
            บริการเช่ารถทั่วไทย สะดวก ราคายุติธรรม พร้อมให้บริการ 24 ชม.
          </Typography>
          <Box mt={4}>
            <DateRangePicker />
          </Box>
        </Box>
        <Container maxWidth="lg" className={styles.featuresContainer}>
          <Paper elevation={0} className={styles.featuresPaper}>
            <Typography className={styles.featuresTitle}>
              ทำไมถึงต้อง Rent Car Rent Jai?
            </Typography>
            <Grid container spacing={2}>
              {[
                "🚗 รถใหม่ หลากหลายรุ่น",
                "🧾 ระบบจองใช้งานง่าย",
                "💵 ไม่มีค่าใช้จ่ายแอบแฝง",
                "🧑‍🔧 บริการช่วยเหลือตลอด 24 ชม.",
                "📍 มีสาขาทั่วประเทศ",
                "🛡️ ประกันภัยครบทุกคัน",
              ].map((text, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Typography className={styles.featureItem}>{text}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Box component="footer" className={styles.footer}>
        <Typography className={styles.footerText}>
          © {new Date().getFullYear()} Rent Car Rent Jai — All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
