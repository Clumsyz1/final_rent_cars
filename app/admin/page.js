"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button, Grid, Paper, Typography, Divider } from "@mui/material";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser(data);
        setRole(data.role);
        if (data.role !== "admin") {
          alert("เฉพาะแอดมินเท่านั้นที่เข้าถึงหน้านี้ได้");
          router.push("/");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user || role !== "admin") return null;

  return (
    <Grid container spacing={3} p={4}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          👑 หน้าผู้ดูแลระบบ (Admin)
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push("/admin/dashboard")}
          sx={{ mb: 2 }}
        >
          📦 ดูสต๊อกรถ
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/admin/bookings")}
          sx={{ mb: 2 }}
        >
          📜 ประวัติการเช่าทั้งหมด
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/admin/managecars")}
        >
          ➕➖ จัดการรถ
        </Button>
      </Grid>
    </Grid>
  );
}
