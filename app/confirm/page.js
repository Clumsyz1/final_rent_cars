"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import MyAppBar from "@/components/Appbar";

export default function ConfirmPage() {
  const router = useRouter();
  const [car, setCar] = useState(null); // เก็บข้อมูลของรถที่เลือก
  const [loading, setLoading] = useState(true); // ใช้สำหรับเช็คสถานะการโหลดข้อมูล
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่เข้าสู่ระบบ

  const [carId, setCarId] = useState(null); // เก็บ carId ที่ถูกส่งมาจาก query string
  const [startDate, setStartDate] = useState(null); // เก็บวันที่เริ่มเช่า
  const [endDate, setEndDate] = useState(null); // เก็บวันที่คืนรถ

  const [days, setDays] = useState(0); // เก็บจำนวนวันที่เช่า
  const [total, setTotal] = useState(0); // เก็บราคารวมทั้งหมด

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCarId(params.get("carId")); // ดึง carId จาก URL
    setStartDate(params.get("start")); // ดึงวันที่เริ่มเช่า
    setEndDate(params.get("end")); // ดึงวันที่คืนรถ
  }, []);

  useEffect(() => {
    if (!carId || !startDate || !endDate) return;

    // เช็คสถานะผู้ใช้ที่เข้าสู่ระบบ
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchCar = async () => {
      // ตรวจสอบข้อมูล carId, startDate, endDate หากไม่ครบให้ไปหน้าหลัก
      if (
        !carId ||
        !startDate ||
        !endDate ||
        startDate === "null" ||
        endDate === "null"
      ) {
        alert("ข้อมูลไม่ครบ กรุณาเลือกวันที่ใหม่");
        router.push("/");
        return;
      }

      // ดึงข้อมูลรถจาก Firestore
      const carRef = doc(db, "cars", carId);
      const carSnap = await getDoc(carRef);
      if (carSnap.exists()) {
        const carData = { id: carSnap.id, ...carSnap.data() };
        setCar(carData);

        // คำนวณจำนวนวันที่เช่าและราคารวม
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        setDays(diffDays);
        setTotal(carData.pricePerDay * diffDays); // คำนวณราคารวม
      }
      setLoading(false); // เมื่อโหลดเสร็จให้เปลี่ยนสถานะ loading
    };

    fetchCar(); // เรียกใช้ฟังก์ชัน fetchCar
  }, [carId, startDate, endDate]);

  // ฟังก์ชันสำหรับยืนยันการจอง
  const handleConfirmBooking = async () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน"); // หากผู้ใช้ยังไม่ได้เข้าสู่ระบบ ให้แจ้งเตือน
      return;
    }

    // เพิ่มข้อมูลการจองลงใน Firestore
    await addDoc(collection(db, "bookings"), {
      carId,
      userId: user.uid,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    });

    alert("การจองเสร็จสิ้น"); // แจ้งเตือนการจองเสร็จสิ้น
    router.push("/"); // พาผู้ใช้กลับไปหน้าหลัก
  };

  // หากกำลังโหลดข้อมูลจะแสดง CircularProgress
  if (loading) {
    return (
      <Grid container justifyContent="center" mt={10}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div>
      <MyAppBar />

      <Grid container justifyContent="center" mt={5}>
        <Grid item xs={12} sm={10} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              ยืนยันการจองรถ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {car ? (
              <>
                <Typography variant="h6">{car.name}</Typography>
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  style={{
                    width: "450px",
                    height: "290px",
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                />
                <Box mt={2}>
                  <Typography>วันที่เช่า: {startDate}</Typography>
                  <Typography>วันคืนรถ: {endDate}</Typography>
                  <Typography>จำนวนวัน: {days} วัน</Typography>
                  <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                  <Typography fontWeight="bold">
                    ราคารวม: ฿{total.toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  fullWidth
                  onClick={handleConfirmBooking}
                >
                  ✅ ยืนยันการจอง
                </Button>
              </>
            ) : (
              <Typography>ไม่พบข้อมูลรถ</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
