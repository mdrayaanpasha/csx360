import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, CircularProgress, Chip } from '@mui/material';
import { ShoppingCart, Star, RateReview, Report } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BrandDetails = () => {
  const { brandId } = useParams();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.post(
          `https://brands.cx360.in/api/dashboard`,
          { id: brandId },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setBrandData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching brand data');
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Sentiment Analysis Donut Chart Data
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: 'Sentiment Analysis',
      data: [
        brandData.sentiment_positive, 
        brandData.sentiment_neutral, 
        brandData.sentiment_negative
      ],
      backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
      hoverBackgroundColor: ['#388e3c', '#1976d2', '#d32f2f'],
      borderWidth: 2,
      cutout: '70%',
    }],
  };

  // Complaints Chart Data
  const complaintsData = JSON.parse(brandData.complaints_over_time);
  const complaintsChartData = {
    labels: complaintsData.map(item => item.month),
    datasets: [{
      label: 'Complaints Over Time',
      data: complaintsData.map(item => item.complaints),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: true,
    }],
  };

  // Ratings Chart Data
  const ratingsData = JSON.parse(brandData.ratings_over_time);
  const ratingsChartData = {
    labels: ratingsData.map(item => item.month),
    datasets: [{
      label: 'Ratings Over Time',
      data: ratingsData.map(item => item.rating),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  // Engagement Chart Data
  const engagementData = JSON.parse(brandData.engagement_trends);
  const engagementChartData = {
    labels: engagementData.map(item => item.month),
    datasets: [{
      label: 'Engagement Score Over Time',
      data: engagementData.map(item => item.engagement_score),
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true,
    }],
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', padding: '20px' }}>
      {/* ====Brand Information Section==== */}
      <Typography variant="h3" color="primary">{brandData.brand_name}</Typography>
      <Typography variant="h6" color="textSecondary" style={{ marginBottom: '20px' }}>
        {brandData.brand_tagline}
      </Typography>

        {/* ====Brand Description Section==== */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap:'wrap', gap: '20px' }}>
          <div style={{ flex: 1, margin: '10px' }}>
            <div style={{
              backgroundColor: '#fafafa',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                backgroundColor: '#f0f0f0',
                padding: '10px 16px',
                borderBottom: '1px solid #ddd',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
              }}>
                Brand Description
              </div>
              <div style={{ padding: '16px', color: '#555' }}>
                <Typography variant="body1" color="textSecondary">{brandData.brand_description_500}</Typography>
              </div>
            </div>
        </div>


        {/* ====Brand Stats Section==== */}
        <div style={{ flex: 1, margin: '10px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {[
            { icon: <ShoppingCart fontSize="large" />, label: 'Total Products', value: brandData.total_products, color: '#4caf50' },
            { icon: <Star fontSize="large" />, label: 'Average Rating', value: brandData.average_rating, color: '#ff9800' },
            { icon: <RateReview fontSize="large" />, label: 'Total Reviews', value: brandData.total_reviews, color: '#2196f3' },
            { icon: <Report fontSize="large" />, label: 'Total Complaints', value: brandData.total_complaints, color: '#f44336' }
          ].map((item, index) => (
            <div key={index} style={{ width: '180px', height: '100px', textAlign: 'center', borderRadius: '8px', border: '1px solid #ddd', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
              <div style={{ color: item.color, marginBottom: '10px' }}>{item.icon}</div>
              <Typography variant="body2" color="textSecondary">{item.label}</Typography>
              <Typography variant="h6">{item.value}</Typography>
            </div>
          ))}
        </div>
      </div>

      <hr/>

     {/* ====Competitors and Best Sellers Section==== */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
        {/* Competitors Section */}
        <div style={{ flex: '1 1 45%' }}>
          <Typography variant="h5" color="textPrimary">Competitors</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {JSON.parse(brandData.primary_competitors).map((item, index) => (
              <Chip
                key={index}
                label={item}
                style={{ backgroundColor: '#2196f3', color: '#fff' }}
              />
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div style={{ flex: '1 1 45%' }}>
          <Typography variant="h5" color="textPrimary">Best Sellers</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {JSON.parse(brandData.best_sellers).map((item, index) => (
              <Chip
                key={index}
                label={item}
                style={{ backgroundColor: '#f50057', color: '#fff' }}
              />
            ))}
          </div>
        </div>
      </div>


      {/* ====Charts and Sentiment Analysis Section==== */}
      <center>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
        {/* Sentiment Analysis Section */}
        <div style={{ flex: '0 0 40%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <div style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '10px', marginBottom: '20px' }}>
            <Typography variant="h5" color="textPrimary">Sentiment Analysis</Typography>
          </div>

          <div style={{ height: '300px', borderRadius: '10px', marginTop: '20px' }}>
            <Doughnut data={sentimentData} />
          </div>
        </div>

        {/* Complaints Over Time Section */}
        <div style={{ flex: '0 0 40%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <div style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '10px', marginBottom: '20px' }}>
            <Typography variant="h5" color="textPrimary">Complaints Over Time</Typography>
          </div>
          
          <div style={{ height: '300px', borderRadius: '10px', marginTop: '20px' }}>
            <Line data={complaintsChartData} />
          </div>
        </div>

      </div>
      </center>


{/* ====Ratings Over Time Section==== */}

      <center>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
{/* ====Ratings Over Time Section==== */}
        <div style={{ flex: '0 0 40%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <div style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '10px', marginBottom: '20px' }}>
            <Typography variant="h5" color="textPrimary">Sentiment Analysis</Typography>
          </div>

          <div style={{ height: '300px', borderRadius: '10px', marginTop: '20px' }}>
          <Line data={ratingsChartData} />
          </div>
        </div>

        {/* Complaints Over Time Section */}
        <div style={{ flex: '0 0 40%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <div style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '10px', marginBottom: '20px' }}>
            <Typography variant="h5" color="textPrimary">Engagement Score</Typography>
          </div>
          
          <div style={{ height: '300px', borderRadius: '10px', marginTop: '20px' }}>
          <Line data={engagementChartData} />
          </div>
        </div>

      </div>
      </center>



      




      
    </div>
  );
};

export default BrandDetails;
