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
  const router = useRouter();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ฟิลเตอร์
  const [transmission, setTransmission] = useState("any");
  const [fuelType, setFuelType] = useState("any");
  const [bodyType, setBodyType] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [yearRange, setYearRange] = useState([2000, 2025]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStartDate(params.get("start"));
    setEndDate(params.get("end"));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate || startDate === "null" || endDate === "null") {
      return;
    }

    const fetchData = async () => {
      const carSnapshot = await getDocs(collection(db, "cars"));
      const carList = carSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bookingSnapshot = await getDocs(
        query(
          collection(db, "bookings"),
          where("startDate", "<=", endDate),
          where("endDate", ">=", startDate)
        )
      );
      const bookingList = bookingSnapshot.docs.map((doc) => doc.data());

      setCars(carList);
      setBookings(bookingList);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate]);

  const getAvailableStock = (carId, stock) => {
    const booked = bookings.filter((b) => b.carId === carId).length;
    return stock - booked;
  };

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

  return (
    <Grid container>
      <Grid item xs={12} md={3} p={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Body Type</InputLabel>
            <Select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              label="Body Type"
            >
              <MenuItem value="any">Any</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="Sports Car">Sports Car</MenuItem>
              <MenuItem value="Luxury Sedan">Luxury Sedan</MenuItem>
            </Select>
          </FormControl>

          <Typography gutterBottom>Price Range (฿)</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newVal) => setPriceRange(newVal)}
            min={0}
            max={5000}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom>Year</Typography>
          <Slider
            value={yearRange}
            onChange={(e, newVal) => setYearRange(newVal)}
            min={2000}
            max={2025}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom>Transmission</Typography>
          <ToggleButtonGroup
            value={transmission}
            exclusive
            onChange={(e, val) => setTransmission(val)}
            fullWidth
            sx={{ mb: 2 }}
          >n
            <ToggleButton value="any">Any</ToggleButton>
            <ToggleButton value="manual">Manual</ToggleButton>
            <ToggleButton value="automatic">Automatic</ToggleButton>
          </ToggleButtonGroup>

          <FormControl fullWidth>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              label="Fuel Type"
            >
              <MenuItem value="any">Any</MenuItem>
              <MenuItem value="Gasoline">Gasoline</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>

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
              const isOutOfStock = available <= 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="160"
                      image={car.imageUrl}
                      alt={car.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{car.name}</Typography>
                      <Typography variant="body2" gutterBottom>
                        {car.type}
                      </Typography>
                      <Box
                        display="flex"
                        gap={1}
                        alignItems="center"
                        fontSize={14}
                      >
                        👥 {car.seats} | ⚙ {car.transmission} | ⛽{" "}
                        {car.fuelType}
                      </Box>
                      <Typography mt={1}>฿{car.pricePerDay}/day</Typography>
                      <Typography
                        color={isOutOfStock ? "error" : "primary"}
                        fontWeight="bold"
                        mt={1}
                      >
                        {isOutOfStock
                          ? "❌ Out of Stock"
                          : `✅ เหลือ ${available} คัน`}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={isOutOfStock}
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
