"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Paper,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { db } from "@/app/firebase/config"; // เชื่อมต่อกับ Firebase
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; // ฟังก์ชันที่ใช้ดึงข้อมูลจาก Firestore
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyAppBar from "@/components/Appbar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]); // สถานะของข้อมูลการจอง
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      // ฟังก์ชันดึงข้อมูลการจอง
      const snapshot = await getDocs(collection(db, "bookings")); // ดึงข้อมูลจากคอลเล็กชัน 'bookings'
      const bookingList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = docSnap.data(); // ดึงข้อมูลการจองจากแต่ละเอกสาร

          const carSnap = await getDoc(doc(db, "cars", booking.carId)); // ดึงข้อมูลจากคอลเล็กชัน 'cars' โดยใช้ carId
          const carData = carSnap.exists() ? carSnap.data() : null; // ตรวจสอบว่ามีข้อมูลรถยนต์หรือไม่

          const userSnap = await getDoc(doc(db, "users", booking.userId)); // ดึงข้อมูลจากคอลเล็กชัน 'users' โดยใช้ userId
          const userData = userSnap.exists() ? userSnap.data() : null; // ตรวจสอบว่ามีข้อมูลผู้ใช้งานหรือไม่

          return {
            ...booking, // รวมข้อมูลการจอง
            car: carData, // รวมข้อมูลรถยนต์
            user: userData, // รวมข้อมูลผู้ใช้งาน
          };
        })
      );

      setBookings(bookingList); // อัปเดตข้อมูลการจองที่ได้จาก Firestore
      setLoading(false); // เปลี่ยนสถานะการโหลดข้อมูลเป็น false
    };

    fetchBookings(); // เรียกใช้งานฟังก์ชันดึงข้อมูล
  }, []);

  return (
    <div>
      <MyAppBar />

      <Paper sx={{ p: 4, m: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => router.push("/admin")} // กดปุ่มย้อนกลับไปหน้าแอดมิน
          sx={{ mb: 2 }}
        >
          ย้อนกลับ
        </Button>
        <Typography variant="h4" gutterBottom>
          📜 ประวัติการจองทั้งหมด
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? ( // ถ้ากำลังโหลดข้อมูลให้แสดง CircularProgress
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : bookings.length === 0 ? ( // ถ้าไม่มีข้อมูลการจองให้แสดงข้อความ
          <Typography>ไม่มีข้อมูลการจอง</Typography>
        ) : (
          // ถ้ามีข้อมูลการจองให้แสดงรายการการจอง
          <Grid container spacing={2}>
            {bookings.map(
              (
                booking,
                index // แสดงข้อมูลการจองแต่ละรายการ
              ) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: "100%" }}>
                    {booking.car?.imageUrl && ( // ถ้ามี URL ของรูปภาพรถยนต์ให้แสดงรูป
                      <CardMedia
                        component="img"
                        image={booking.car.imageUrl}
                        alt={booking.car.name}
                        sx={{
                          width: "300px", // ทำให้รูปไม่เกิน card
                          height: "230px", // ความสูงคงที่
                          objectFit: "fill", // ครอบตัดรูปให้พอดี
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">
                        🚗 {booking.car?.name || "ไม่พบข้อมูลรถ"}
                      </Typography>
                      <Typography variant="body2">
                        📅 {booking.startDate} - {booking.endDate}
                        <br />
                        👤 ผู้เช่า:{" "}
                        {booking.user
                          ? `${booking.user.firstName} ${booking.user.lastName}`
                          : booking.userId}{" "}
                        <br />
                        📞 เบอร์โทร: {booking.user?.phone || "-"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        )}
      </Paper>
    </div>
  );
}
