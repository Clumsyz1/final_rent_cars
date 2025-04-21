"use client";

import {
  Typography,
  Grid,
  Paper,
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

export default function BookingPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
        await fetchBookings(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBookings = async (uid) => {
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
    setLoading(false);
  };

  return (
    <div>
      <MyAppBar />
      <Grid container spacing={3} p={4}>
        {/* Sidebar */}
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
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
          </Paper>
        </Grid>

        {/* Booking History */}
        <Grid item xs={12} sm={9}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              ประวัติการจอง
            </Typography>
            <Divider sx={{ mb: 3 }} />

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
                        style={{
                          width: "180px",
                          height: "130px",
                          borderRadius: 8,
                          objectFit: "fill",
                          marginRight: "16px",
                        }}
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
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
