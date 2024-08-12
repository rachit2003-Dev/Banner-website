import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner from './components/Banner';
import Dashboard from './components/Dashboard';
import styled from 'styled-components';

const AppContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

function App() {
  const [bannerData, setBannerData] = useState({});
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const result = await axios('https://banner-website.onrender.com/api/banner');
        setBannerData(result.data);
        setBannerVisible(result.data.isVisible);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };
    fetchBannerData();
  }, []);

  return (
    <AppContainer>
      <Dashboard 
        onBannerVisibilityChange={setBannerVisible} 
        setBannerData={setBannerData}
      />
      {bannerVisible && <Banner data={bannerData} />}
    </AppContainer>
  );
}

export default App;
