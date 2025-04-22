"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config"; // นำเข้า auth และ db จาก Firebase
import { onAuthStateChanged } from "firebase/auth"; // ฟังก์ชันตรวจสอบสถานะผู้ใช้
import { doc, getDoc } from "firebase/firestore"; // ฟังก์ชันในการดึงข้อมูลจาก Firestore
import { useRouter } from "next/navigation"; // ใช้ router เพื่อเปลี่ยนเส้นทาง
import { Button, Paper, Typography, Divider, Container } from "@mui/material"; // ใช้คอมโพเนนต์จาก MUI
import MyAppBar from "@/components/Appbar"; // นำเข้า AppBar ของเราเอง
import styles from "./AdminPage.module.css"; // นำเข้าไฟล์ CSS สำหรับจัดการสไตล์

export default function AdminPage() {
  const [user, setUser] = useState(null); // สเตตัสผู้ใช้
  const [role, setRole] = useState(null); // สเตตัสของบทบาทผู้ใช้ (เช่น admin, user)
  const router = useRouter(); // ใช้ router สำหรับการเปลี่ยนเส้นทาง

  // ฟังก์ชัน useEffect จะถูกเรียกเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // ถ้าผู้ใช้ไม่ได้ล็อกอิน จะเปลี่ยนเส้นทางไปที่หน้าล็อกอิน
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      // ดึงข้อมูลของผู้ใช้จาก Firestore
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data(); // ดึงข้อมูลผู้ใช้
        setUser(data); // เก็บข้อมูลผู้ใช้ใน state
        setRole(data.role); // เก็บบทบาทผู้ใช้ใน state
        // ถ้าบทบาทไม่ใช่ admin จะมีข้อความแจ้งเตือนและเปลี่ยนเส้นทาง
        if (data.role !== "admin") {
          alert("เฉพาะแอดมินเท่านั้นที่เข้าถึงหน้านี้ได้");
          router.push("/"); // เปลี่ยนเส้นทางไปหน้าแรก
        }
      }
    });

    return () => unsubscribe(); // เมื่อคอมโพเนนต์ถูกทำลาย จะยกเลิกการสมัครสมาชิก
  }, [router]);

  // ถ้าผู้ใช้ยังไม่ถูกโหลดหรือไม่ได้เป็น admin จะไม่แสดงอะไร
  if (!user || role !== "admin") return null;

  return (
    <div>
      <MyAppBar /> {/* แสดง AppBar */}
      <Container className={styles.container}>
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            👑 แผงควบคุมผู้ดูแลระบบ
          </Typography>
          <Divider className={styles.divider} />
          {/* ปุ่มสำหรับไปยังหน้าจัดการสต็อกรถ */}
          <Button
            variant="contained"
            className={styles.button}
            onClick={() => router.push("/admin/dashboard")}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              📦 จัดการสต็อกรถ
            </Typography>
          </Button>
          {/* ปุ่มสำหรับไปยังหน้าดูประวัติการเช่า */}
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
          {/* ปุ่มสำหรับไปยังหน้าจัดการรายการรถ */}
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
