"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Button,
  Paper,
  Typography,
  Divider,
  styled,
  Container,
} from "@mui/material";
import MyAppBar from "@/components/Appbar";

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  maxWidth: 400,
  width: "100%",
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  width: "80%",
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
}));

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser(data);
        setRole(data.role);
        if (data.role !== "admin") {
          alert("เฉพาะแอดมินเท่านั้นที่เข้าถึงหน้านี้ได้");
          router.push("/");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user || role !== "admin") return null;

  return (
    <div>
      <MyAppBar />
      <StyledContainer>
        <StyledPaper>
          <StyledTitle variant="h4" align="center">
            👑 แผงควบคุมผู้ดูแลระบบ
          </StyledTitle>
          <StyledDivider />
          <StyledButton
            variant="contained"
            onClick={() => router.push("/admin/dashboard")}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              📦 จัดการสต็อกรถ
            </Typography>
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => router.push("/admin/bookings")}
            color="primary"
          >
            <Typography variant="subtitle1" fontWeight={500}>
              📜 ดูประวัติการเช่า
            </Typography>
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => router.push("/admin/managecars")}
            color="primary"
          >
            <Typography variant="subtitle1" fontWeight={500}>
              ➕➖ จัดการรายการรถ
            </Typography>
          </StyledButton>
        </StyledPaper>
      </StyledContainer>
    </div>
  );
}
