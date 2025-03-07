import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  CameraAlt,
  AddAPhoto ,
  Work,
  EmojiPeople,
  MonetizationOn
} from "@mui/icons-material";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";

function LoginPage() {
  useEffect(() => {
    document.title = `Login`;
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60vh",
          backgroundColor: "#F0EBFA",
          clipPath: "ellipse(150% 100% at 50% 0%)",
          zIndex: 1,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Header />
      </Box>

      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          px: 1,
          py: 4,
          pb: 2,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction="column"
          textAlign="center"
        >
          <Grid item xs={12}>
            <Box
              sx={{
                px: { xs: 2, sm: 0, md: 4, lg: 2 },
                maxWidth: { xs: "100%", sm: "100%", md: "80%", lg: "80%" },
                mx: "auto",
                width: "100%",
                p: 0,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="700"
                gutterBottom
                sx={{
                  lineHeight: 1.2,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  fontFamily: "Inter, sans-serif",
                  color: "#35414B",
                }}
              >
                Welcome to
              </Typography>
              <Typography
                variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  lineHeight: 1.2,
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontFamily: "Inter, sans-serif",
                  color: "#35414B",
                }}
              >
                Eco Sathi
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                paragraph
                sx={{
                  lineHeight: 1.3, // Adjust this to make the lines closer
                  fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" }, // Slightly smaller font
                  color: "#4E5A65",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Eco Sathi is your reliable partner in waste management.
                 Users can report waste issues with photos, prompting municipal
                 workers to clean the area. Earn rewards through blockchain while                 
                  contributing to a cleaner, greener community.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <LoginForm />
          </Grid>
        </Grid>
      </Box>

      <Box
  sx={{
    backgroundColor: "#fff",
    py: 1,
    width: "100%",
    pb: {
      xs: 1,
      md: 5,
    },
  }}
>
  <Grid container spacing={3} justifyContent="center">
    <Grid item>
      <Box textAlign="center" sx={{ mb: 1 }}>
        <CameraAlt fontSize="large" color="primary" />
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
        >
          Report Waste
        </Typography>
      </Box>
    </Grid>
    <Grid item>
      <Box textAlign="center" sx={{ mb: 1 }}>
        <AddAPhoto fontSize="large" color="primary" />
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
        >
          Upload Evidence
        </Typography>
      </Box>
    </Grid>
    <Grid item>
      <Box textAlign="center" sx={{ mb: 1 }}>
        <EmojiPeople fontSize="large" color="primary" />
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
        >
          Community Involvement
        </Typography>
      </Box>
    </Grid>
    <Grid item>
      <Box textAlign="center" sx={{ mb: 1 }}>
        <Work fontSize="large" color="primary" />
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
        >
          Municipal Response
        </Typography>
      </Box>
    </Grid>
    <Grid item>
      <Box textAlign="center" sx={{ mb: 1 }}>
        <MonetizationOn fontSize="large" color="primary" />
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
        >
          Earn Rewards
        </Typography>
      </Box>
    </Grid>
  </Grid>
</Box>


      <Footer />
    </Box>
  );
}

export default LoginPage;
