import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BannerContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const Countdown = styled.p`
  font-weight: bold;
  font-size: 1.2em;
`;

const BannerLink = styled.a`
  color: #004085;
  text-decoration: none;
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const ToggleButton = styled.button`
  margin: 10px;
  padding: 11.6px 20px;
  transform: translateY(-1px);
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const DownloadButton = styled.button`
  margin: 10px;
  padding: 11.6px 20px;
  transform: translateY(-1px);
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

function Banner({ data }) {
  const [timeLeft, setTimeLeft] = useState(Number(data.timer) || 0);
  const [imageVisible, setImageVisible] = useState(data.imageVisible || true);

  useEffect(() => {
    if (timeLeft <= 0) {
      setImageVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(Number(data.timer) || 0);
    setImageVisible(data.imageVisible || true);
  }, [data.timer, data.imageVisible]);

  const toggleImageVisibility = async () => {
    try {
      const newImageVisibility = !imageVisible;
      await axios.post('/api/updateBanner', {
        ...data,
        imageVisible: newImageVisibility,
      });
      setImageVisible(newImageVisibility);
    } catch (error) {
      console.error('Error updating image visibility:', error);
    }
  };

  const downloadImageAsPDF = async () => {
    if (!data.link) return;

    try {
      const img = document.querySelector('#banner-image');
      if (!img) return;

      const canvas = await html2canvas(img, { useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = canvas.width * 0.75;
      const imgHeight = canvas.height * 0.75;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('banner-image.pdf');
    } catch (error) {
      console.error('Error downloading image as PDF:', error);
    }
  };

  return (
    <BannerContainer>
      <p>{data.description}</p>
      {imageVisible && data.link && (
        <Image id="banner-image" src={data.link} alt="Banner Image" />
      )}
      <Countdown>Time Left: {timeLeft}s</Countdown>
      <BannerLink href={data.link} target="_blank" rel="noopener noreferrer">Click Here</BannerLink>
      <ToggleButton 
        onClick={toggleImageVisibility} 
        disabled={timeLeft === 0}
      >
        {imageVisible ? 'Hide Image' : 'Show Image'}
      </ToggleButton>
      <DownloadButton 
        onClick={downloadImageAsPDF} 
        disabled={!imageVisible || timeLeft === 0}
      >
        Download as PDF
      </DownloadButton>
    </BannerContainer>
  );
}

export default Banner;
