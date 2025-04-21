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
      setMessage("ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <MyAppBar />

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
          <Typography variant="h5" mb={2}>
            ลืมรหัสผ่าน
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => setMessage("")}
        >
          <Alert onClose={() => setMessage("")} severity="success">
            {message}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}
