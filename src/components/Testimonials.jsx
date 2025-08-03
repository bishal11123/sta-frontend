import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Avatar, Paper, Container } from '@mui/material';

const testimonials = [
  {
    name: 'Sita Tamang',
    country: 'Nepal',
    text: 'Thanks to Japani Pathshala, I passed JLPT N4 and got selected for a bachelor program in Japan!',
    img: 'https://randomuser.me/api/portraits/women/79.jpg',
  },
  {
    name: 'Daniel Lee',
    country: 'Singapore',
    text: 'Their online classes are very organized and the JFT mock tests were spot on!',
    img: 'https://randomuser.me/api/portraits/men/43.jpg',
  },
  {
    name: 'Rika Watanabe',
    country: 'USA',
    text: 'I learned Hiragana in one week thanks to their beginner course and practice system!',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    autoplay: true,
    speed: 500,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box py={10} bgcolor="#f0f0f0">
      <Container>
        <Typography variant="h4" textAlign="center" gutterBottom>
          ❤️ What Students Say
        </Typography>
        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <Box key={i} px={4}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Avatar src={t.img} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                <Typography variant="body1" fontStyle="italic">"{t.text}"</Typography>
                <Typography variant="h6" mt={2}>{t.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t.country}</Typography>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default Testimonials;
