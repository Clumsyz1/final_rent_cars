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
import MyAppBar from "@/components/Appbar";
import DateRangePicker from "@/components/DateRangePicker";
import { useEffect, useState } from "react";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#ADB2D4",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MyAppBar />
      <Fade in={loaded} timeout={700}>
        <Box sx={{ flex: 1, pt: { xs: 8, sm: 10 }, pb: 4 }}>
          {/* Hero + Date Picker Section */}
          <Box
            sx={{
              background: "linear-gradient(to bottom right, #ffffff, #dce0f1)",
              py: 6,
              borderRadius: 3,
              maxWidth: "1100px",
              mx: "auto",
              px: { xs: 3, sm: 5 },
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h3"
              align="center"
              fontWeight={700}
              color="#1E2A78"
            >
              EasyCarRent
            </Typography>
            <Typography variant="h6" align="center" mt={2} color="#555">
              บริการเช่ารถทั่วไทย สะดวก ราคายุติธรรม พร้อมให้บริการ 24 ชม.
            </Typography>

            <Box mt={4}>
              <DateRangePicker />
            </Box>
          </Box>

          {/* Features Section */}
          <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 3,
                backgroundColor: "#e6e9f4",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700} color="#1E2A78" mb={3}>
                ทำไมถึงต้อง EasyCarRent?
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
                    <Typography variant="body1" color="#444">
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
      <Box component="footer" sx={{ backgroundColor: "#1E2A78", py: 3 }}>
        <Typography
          variant="body2"
          color="white"
          align="center"
          sx={{ opacity: 0.8 }}
        >
          © {new Date().getFullYear()} EasyCarRent — All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
