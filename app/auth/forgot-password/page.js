"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import MyAppBar from "@/components/Appbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบกล่องข้อความของคุณ");
      setEmail("");
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  return (
    <div>
      <MyAppBar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #e0f7fa, #ffffff)",
          p: 2,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            maxWidth: 450,
            width: "100%",
            borderRadius: 3,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            color="primary"
            mb={3}
          >
            ลืมรหัสผ่าน
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="อีเมลของคุณ"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
            >
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </Button>
          </form>

          <Typography
            variant="body2"
            textAlign="center"
            mt={3}
            color="text.secondary"
          >
            กลับไปหน้า{" "}
            <a
              href="/auth/sign-in"
              style={{
                color: "#1976d2",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              เข้าสู่ระบบ
            </a>
          </Typography>
        </Paper>

        {/* Snackbar สำหรับแจ้งเตือน */}
        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => setMessage("")}
        >
          <Alert
            onClose={() => setMessage("")}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}
