"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
} from "@mui/material";
import { db } from "@/app/firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const bookingList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = docSnap.data();
          const carSnap = await getDoc(doc(db, "cars", booking.carId));
          return {
            ...booking,
            car: carSnap.exists() ? carSnap.data() : null,
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
        <List>
          {bookings.map((booking, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`🚗 ${booking.car?.name || "ไม่พบข้อมูลรถ"}`}
                secondary={
                  <>
                    📅 {booking.startDate} - {booking.endDate}
                    <br />
                    👤 ผู้ใช้: {booking.userId}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
