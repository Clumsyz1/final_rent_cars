"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  Box,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyAppBar from "@/components/Appbar";

export default function ManageCars() {
  const [cars, setCars] = useState([]); // เก็บข้อมูลรถทั้งหมดจากฐานข้อมูล
  const [editId, setEditId] = useState(null); // เก็บ ID ของรถที่กำลังแก้ไข
  const router = useRouter();

  // ฟอร์มข้อมูลรถที่กรอก
  const [form, setForm] = useState({
    name: "",
    type: "SUV",
    pricePerDay: "",
    stock: "",
    imageUrl: "",
    fuelType: "Gasoline",
    transmission: "manual",
    seats: "",
    year: "",
  });

  // เรียกใช้ฟังก์ชัน fetchCars เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    fetchCars();
  }, []);

  // ฟังก์ชันดึงข้อมูลรถจาก Firebase
  const fetchCars = async () => {
    const snapshot = await getDocs(collection(db, "cars"));
    const carList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCars(carList);
  };

  // ฟังก์ชันเพิ่มหรืออัปเดตรถ
  const handleAddOrUpdateCar = async () => {
    const carData = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      stock: Number(form.stock),
      seats: Number(form.seats),
      year: Number(form.year),
    };

    if (editId) {
      // หากมี editId จะทำการอัปเดตข้อมูลรถที่มีอยู่
      await updateDoc(doc(db, "cars", editId), carData);
    } else {
      // หากไม่มี editId จะทำการเพิ่มรถใหม่
      await addDoc(collection(db, "cars"), carData);
    }

    // รีเซ็ตฟอร์มหลังจากบันทึกข้อมูล
    setForm({
      name: "",
      type: "SUV",
      pricePerDay: "",
      stock: "",
      imageUrl: "",
      fuelType: "Gasoline",
      transmission: "manual",
      seats: "",
      year: "",
    });
    setEditId(null); // รีเซ็ต editId
    fetchCars(); // ดึงข้อมูลรถใหม่หลังจากเพิ่มหรือแก้ไข
  };

  // ฟังก์ชันลบรถ
  const handleDeleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
    fetchCars(); // รีเฟรชข้อมูลรถ
  };

  // ฟังก์ชันแก้ไขรถ
  const handleEditCar = (car) => {
    setForm({
      name: car.name || "",
      type: car.type || "",
      pricePerDay: car.pricePerDay || "",
      stock: car.stock || "",
      imageUrl: car.imageUrl || "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      seats: car.seats || "",
      year: car.year || "",
    });
    setEditId(car.id); // กำหนด editId เป็น ID ของรถที่กำลังจะแก้ไข
    window.scrollTo({ top: 0, behavior: "smooth" }); // เลื่อนหน้าไปด้านบน
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ตัวเลือกสำหรับประเภทต่างๆ
  const BodyType = [
    { value: "SUV", label: "SUV" },
    { value: "Sedan", label: "Sedan" },
    { value: "Sports Car", label: "Sports Car" },
    { value: "Luxury Sedan", label: "Luxury Sedan" },
  ];

  const Transmission = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
  ];

  const FuelType = [
    { value: "Gasoline", label: "Gasoline" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <div>
      <MyAppBar />
      <Paper sx={{ p: 4, m: 3 }}>
        {/* ปุ่มย้อนกลับ */}
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => router.push("/admin")}
          sx={{ mb: 3 }}
        >
          ย้อนกลับ
        </Button>

        {/* หัวข้อ */}
        <Typography variant="h4" gutterBottom>
          {editId ? "✏️ แก้ไขรถ" : "➕➖ จัดการรถ"}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* ฟอร์มกรอกข้อมูลรถ */}
        <Grid container spacing={2} mb={4}>
          {/* ชื่อรถ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ชื่อรถ"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* ประเภทรถ */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ประเภทรถ"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              required
            >
              {BodyType.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* ราคา/วัน */}
          <Grid item xs={6} sm={3}>
            <TextField
              label="ราคา/วัน"
              name="pricePerDay"
              type="number"
              value={form.pricePerDay}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* จำนวนคัน */}
          <Grid item xs={6} sm={3}>
            <TextField
              label="จำนวนคัน"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* ที่นั่ง */}
          <Grid item xs={6} sm={3}>
            <TextField
              label="ที่นั่ง"
              name="seats"
              type="number"
              value={form.seats}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* ปี */}
          <Grid item xs={6} sm={3}>
            <TextField
              label="ปี"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* ระบบเกียร์ */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ระบบเกียร์"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              fullWidth
              required
            >
              {Transmission.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* เชื้อเพลิง */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="เชื้อเพลิง"
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              fullWidth
              required
            >
              {FuelType.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* URL รูปภาพ */}
          <Grid item xs={12}>
            <TextField
              label="URL รูปภาพ"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* ปุ่มเพิ่มหรือแก้ไข */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleAddOrUpdateCar}
                color={editId ? "warning" : "primary"}
              >
                {editId ? "✅ บันทึกการแก้ไข" : "➕ เพิ่มรถ"}
              </Button>
              {editId && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      name: "",
                      type: "SUV",
                      pricePerDay: "",
                      stock: "",
                      imageUrl: "",
                      fuelType: "Gasoline",
                      transmission: "manual",
                      seats: "",
                      year: "",
                    });
                  }}
                >
                  ❌ ยกเลิก
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          รายการรถทั้งหมด
        </Typography>

        {/* แสดงรายการรถ */}
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  image={car.imageUrl}
                  alt={car.name}
                  sx={{
                    width: "250px",
                    height: "180px",
                    objectFit: "fill",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{car.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ประเภท: {car.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ราคา/วัน: ฿{car.pricePerDay}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ที่นั่ง: {car.seats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ปี: {car.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เกียร์: {car.transmission}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เชื้อเพลิง: {car.fuelType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    จำนวนคัน: {car.stock}
                  </Typography>

                  {/* ปุ่มแก้ไขและลบ */}
                  <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <Tooltip title="แก้ไข">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditCar(car)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ลบ">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
}
