"use client";

// นำเข้าคอมโพเนนต์และฟังก์ชันจาก MUI, React และ Firebase
import {
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import MyAppBar from "@/components/Appbar";
import styles from "./BookingPage.module.css";

export default function BookingPage() {
  // กำหนด state สำหรับข้อมูลผู้ใช้, การจอง, และสถานะการโหลด
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // เช็คสถานะการล็อกอินของผู้ใช้
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/sign-in"); // ถ้าไม่ได้ล็อกอินจะไปที่หน้า Sign In
      } else {
        await fetchBookings(currentUser.uid); // ดึงข้อมูลการจองของผู้ใช้
      }
    });

    return () => unsubscribe(); // ยกเลิกการติดตามสถานะผู้ใช้เมื่อออกจากหน้า
  }, []);

  const fetchBookings = async (uid) => {
    // ดึงข้อมูลการจองจาก Firebase
    const q = query(collection(db, "bookings"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    const bookingList = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const booking = docSnap.data();
        const carSnap = await getDoc(doc(db, "cars", booking.carId));
        return {
          id: docSnap.id,
          ...booking,
          car: carSnap.exists() ? carSnap.data() : null,
        };
      })
    );

    setBookings(bookingList);
    setLoading(false); // เปลี่ยนสถานะการโหลด
  };

  return (
    <div className={styles.container}>
      <MyAppBar />
      <Grid container spacing={3} p={4}>
        {/* Sidebar - ส่วนของเมนูข้าง */}
        <Grid item xs={12} sm={3}>
          <div className={styles.sidebar}>
            <Typography variant="h6" gutterBottom>
              บัญชีของฉัน
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              onClick={() => router.push("/account/profile")}
            >
              👤 โปรไฟล์
            </Button>
            <Button fullWidth variant="contained">
              🚗 การจอง
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 3 }}
              onClick={() => router.push("/")}
            >
              ⬅ ย้อนกลับ
            </Button>
          </div>
        </Grid>

        {/* Booking History - ส่วนของประวัติการจอง */}
        <Grid item xs={12} sm={9}>
          <div className={styles.content}>
            <Typography variant="h5" gutterBottom>
              ประวัติการจอง
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* แสดงการโหลดหรือข้อมูลการจอง */}
            {loading ? (
              <CircularProgress />
            ) : bookings.length === 0 ? (
              <Typography>ไม่มีประวัติการจอง</Typography>
            ) : (
              <List>
                {bookings.map((booking) => (
                  <ListItem key={booking.id} divider alignItems="flex-start">
                    {booking.car?.imageUrl && (
                      <img
                        src={booking.car.imageUrl}
                        alt={booking.car.name}
                        className={styles.carImage}
                      />
                    )}
                    <ListItemText
                      primary={`🚗 ${booking.car?.name || "ไม่พบข้อมูลรถ"}`}
                      secondary={
                        <>
                          📅 {booking.startDate} ถึง {booking.endDate}
                          <br />
                          💰 ราคา: ฿
                          {booking.car?.pricePerDay
                            ? booking.car.pricePerDay *
                              (Math.ceil(
                                (new Date(booking.endDate).getTime() -
                                  new Date(booking.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ) +
                                1)
                            : "N/A"}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
