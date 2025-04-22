"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button, Paper, Typography, Divider, Container } from "@mui/material";
import MyAppBar from "@/components/Appbar";
import styles from "./AdminPage.module.css";

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
    <div>
      <MyAppBar />
      <Container className={styles.container}>
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            👑 แผงควบคุมผู้ดูแลระบบ
          </Typography>
          <Divider className={styles.divider} />
          <Button
            variant="contained"
            className={styles.button}
            onClick={() => router.push("/admin/dashboard")}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              📦 จัดการสต็อกรถ
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={() => router.push("/admin/bookings")}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              📜 ดูประวัติการเช่า
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={() => router.push("/admin/managecars")}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              ➕➖ จัดการรายการรถ
            </Typography>
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
