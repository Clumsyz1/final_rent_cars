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
import { db } from "@/app/firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const bookingList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = docSnap.data();

          const carSnap = await getDoc(doc(db, "cars", booking.carId));
          const carData = carSnap.exists() ? carSnap.data() : null;

          const userSnap = await getDoc(doc(db, "users", booking.userId));
          const userData = userSnap.exists() ? userSnap.data() : null;

          return {
            ...booking,
            car: carData,
            user: userData,
          };
        })
      );

      setBookings(bookingList);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <Paper sx={{ p: 4, m: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push("/admin")}
        sx={{ mb: 2 }}
      >
        ย้อนกลับ
      </Button>
      <Typography variant="h4" gutterBottom>
        📜 ประวัติการจองทั้งหมด
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : bookings.length === 0 ? (
        <Typography>ไม่มีข้อมูลการจอง</Typography>
      ) : (
        <Grid container spacing={2}>
          {bookings.map((booking, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                {booking.car?.imageUrl && (
                  <CardMedia
                    component="img"
                    image={booking.car.imageUrl}
                    alt={booking.car.name}
                    sx={{
                      width: "300px", // ทำให้รูปไม่เกิน card
                      height: "230px", // ความสูงคงที่
                      objectFit: "fill", // ครอบตัดรูปให้พอดี
                    }} // ครอบตัดรูปให้พอดี}}
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
                      : booking.userId}
                    <br />
                    📞 เบอร์โทร: {booking.user?.phone || "-"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
