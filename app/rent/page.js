"use client";

import {
  Grid,
  Typography,
  Paper,
  Slider,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RentPage() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Filters
  const [transmission, setTransmission] = useState("any");
  const [fuelType, setFuelType] = useState("any");
  const [bodyType, setBodyType] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [yearRange, setYearRange] = useState([2000, 2025]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setStartDate(params.get("start"));
      setEndDate(params.get("end"));
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      const carSnap = await getDocs(collection(db, "cars"));
      const carsData = carSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bookingSnap = await getDocs(
        query(
          collection(db, "bookings"),
          where("startDate", "<=", endDate),
          where("endDate", ">=", startDate)
        )
      );
      const bookingsData = bookingSnap.docs.map((doc) => doc.data());

      setCars(carsData);
      setBookings(bookingsData);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate]);

  const getAvailableStock = (carId, stock) =>
    stock - bookings.filter((b) => b.carId === carId).length;

  const filteredCars = cars.filter((car) => {
    const [minPrice, maxPrice] = priceRange;
    const [minYear, maxYear] = yearRange;
    return (
      car.pricePerDay >= minPrice &&
      car.pricePerDay <= maxPrice &&
      car.year >= minYear &&
      car.year <= maxYear &&
      (transmission === "any" || car.transmission === transmission) &&
      (fuelType === "any" || car.fuelType === fuelType) &&
      (bodyType === "any" || car.type === bodyType)
    );
  });

  if (!isClient) return null; // 👈 กัน hydration error

  return (
    <Grid container>
      {/* Sidebar Filters */}
      <Grid item xs={12} md={3} p={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Filters</Typography>

          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Body Type</InputLabel>
            <Select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            >
              <MenuItem value="any">Any</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="Sports Car">Sports Car</MenuItem>
              <MenuItem value="Luxury Sedan">Luxury Sedan</MenuItem>
            </Select>
          </FormControl>

          <Typography>Price Range (฿)</Typography>
          <Slider
            value={priceRange}
            onChange={(e, val) => setPriceRange(val)}
            min={0}
            max={5000}
            valueLabelDisplay="auto"
            sx={{ my: 2 }}
          />

          <Typography>Year</Typography>
          <Slider
            value={yearRange}
            onChange={(e, val) => setYearRange(val)}
            min={2000}
            max={2025}
            valueLabelDisplay="auto"
            sx={{ my: 2 }}
          />

          <Typography>Transmission</Typography>
          <ToggleButtonGroup
            value={transmission}
            exclusive
            onChange={(e, val) => setTransmission(val)}
            fullWidth
            sx={{ my: 2 }}
          >
            <ToggleButton value="any">Any</ToggleButton>
            <ToggleButton value="manual">Manual</ToggleButton>
            <ToggleButton value="automatic">Automatic</ToggleButton>
          </ToggleButtonGroup>

          <FormControl fullWidth>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <MenuItem value="any">Any</MenuItem>
              <MenuItem value="Gasoline">Gasoline</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      {/* Car List */}
      <Grid item xs={12} md={9} p={3}>
        <Typography variant="h4" gutterBottom>
          🚗 เลือกรถที่คุณต้องการเช่า
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          วันที่: {startDate} - {endDate}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Grid container justifyContent="center" mt={5}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {filteredCars.map((car) => {
              const available = getAvailableStock(car.id, car.stock);
              const outOfStock = available <= 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={car.imageUrl}
                      alt={car.name}
                      sx={{
                        width: "250px", // ทำให้รูปไม่เกิน card
                        height: "160px", // ความสูงคงที่
                        objectFit: "fill", // ครอบตัดรูปให้พอดี
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6">{car.name}</Typography>
                      <Typography variant="body2" gutterBottom>
                        {car.type}
                      </Typography>
                      <Box display="flex" gap={1} fontSize={14}>
                        👥 {car.seats} | ⚙ {car.transmission} | ⛽{" "}
                        {car.fuelType}
                      </Box>
                      <Typography mt={1}>฿{car.pricePerDay}/day</Typography>
                      <Typography
                        color={outOfStock ? "error" : "primary"}
                        fontWeight="bold"
                        mt={1}
                      >
                        {outOfStock
                          ? "❌ Out of Stock"
                          : `✅ เหลือ ${available} คัน`}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={outOfStock}
                        sx={{ mt: 1 }}
                        onClick={() =>
                          router.push(
                            `/confirm?carId=${car.id}&start=${startDate}&end=${endDate}`
                          )
                        }
                      >
                        Rent now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
