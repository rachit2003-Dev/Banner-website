import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

const InputField = styled.input`
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 80%;
  max-width: 400px;
  border: 1px solid #ced4da;
  border-radius: 5px;
`;

const UpdateButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

function Dashboard({ onBannerVisibilityChange, setBannerData }) {
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState(0);
  const [link, setLink] = useState('');

  const updateBanner = async () => {
    if (!id) {
      alert('Please enter the ID of the banner you want to update.');
      return;
    }

    try {
      const response = await axios.post('https://banner-website.onrender.com/api/updateBanner', {
        id,
        description,
        timer,
        link,
        isVisible: true,
      });
      setBannerData(response.data);
      onBannerVisibilityChange(true);
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner. Please check the console for details.');
    }
  };

  const addBanner = async () => {
    try {
      const response = await axios.post('https://banner-website.onrender.com/api/addBanner', {
        description,
        timer,
        link,
      });
      setBannerData(response.data);
      onBannerVisibilityChange(true);
    } catch (error) {
      console.error('Error adding banner:', error);
      alert('Failed to add banner. Please check the console for details.');
    }
  };

  return (
    <DashboardContainer>
      <h2>Dashboard</h2>
      <InputField 
        type="text" 
        placeholder="Banner ID (for update only)" 
        value={id} 
        onChange={(e) => setId(e.target.value)} 
      />
      <InputField 
        type="text" 
        placeholder="Banner Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <InputField 
        type="number" 
        placeholder="Timer (seconds)" 
        value={timer} 
        onChange={(e) => setTimer(Number(e.target.value))} 
      />
      <InputField 
        type="text" 
        placeholder="Banner Link" 
        value={link} 
        onChange={(e) => setLink(e.target.value)} 
      />
      <UpdateButton onClick={updateBanner}>Update Banner</UpdateButton>
      <AddButton onClick={addBanner}>Add New Banner</AddButton>
    </DashboardContainer>
  );
}

export default Dashboard;
