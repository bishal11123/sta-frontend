import React, { useCallback } from "react";
import { Box, Typography, Container, Stack, Button } from "@mui/material";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Typewriter } from "react-simple-typewriter";
import YouTube from "react-youtube";
import ChatIcon from "@mui/icons-material/Chat";

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // YouTube video options
  const videoOpts = {
    width: "100%",
    height: "315",
    playerVars: { autoplay: 0 },
  };

  // Scroll helper
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box position="relative" height="100vh" bgcolor="#0d47a1" color="#fff" overflow="hidden">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "#0d47a1" },
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            color: { value: "#fff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { enable: true, speed: 2 },
            links: { enable: true, distance: 150, color: "#fff", opacity: 0.4, width: 1 },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={2}>
          Learn Japanese Online!
        </Typography>

        <Typography variant="h5" mb={3}>
          <Typewriter
            words={[
              "JLPT & JFT Preparation",
              "Bachelor Interview Coaching",
              "Live Online Classes",
              "Mock Tests & Practice",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </Typography>

        <Typography variant="subtitle1" fontStyle="italic" mb={4}>
          日本語を学びましょう！ — Let’s learn Japanese together 🌏
        </Typography>

        <Typography variant="body1" mb={3}>
          🎓 12,000+ Students from 40+ Countries
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center" mb={5}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handleScroll("courses")}
          >
            Explore Courses
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => handleScroll("join")}
          >
            Join Now
          </Button>
        </Stack>

        <Box
          sx={{
            maxWidth: 560,
            mx: "auto",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <YouTube videoId="xLxboWvCkRE" opts={videoOpts} />
        </Box>
      </Container>

      {/* Floating WhatsApp Chat Button */}
      <Button
        variant="contained"
        color="success"
        href="https://wa.me/9779812345678" // Replace with your WhatsApp number
        target="_blank"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "50%",
          minWidth: 0,
          width: 56,
          height: 56,
          zIndex: 1000,
          boxShadow: 3,
        }}
        aria-label="Chat with us"
      >
        <ChatIcon fontSize="large" />
      </Button>
    </Box>
  );
};

export default Hero;
