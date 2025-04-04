// frontend/src/admin/forms/BannerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import axios from 'axios';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    page: 'home',
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });
  
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Available pages for banners
  const availablePages = [
    { value: 'home', label: 'Home Page' },
    { value: 'shop', label: 'Shop Page' },
    { value: 'product', label: 'Product Details' },
    { value: 'checkout', label: 'Checkout Page' },
    { value: 'contact', label: 'Contact Page' }
  ];
  
  // Load banner data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cms/banners/${id}`);
          
          // Format dates for input fields if they exist
          const banner = response.data.data;
          if (banner.startDate) {
            banner.startDate = new Date(banner.startDate).toISOString().split('T')[0];
          }
          if (banner.endDate) {
            banner.endDate = new Date(banner.endDate).toISOString().split('T')[0];
          }
          
          setFormData(banner);
        } catch (err) {
          setError('Failed to load banner data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, isEditing]);
  
  // Load media library
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await axios.get('/api/cms/media?type=image');
        setMediaLibrary(response.data.data || []);
      } catch (err) {
        console.error('Failed to load media:', err);
      }
    };
    
    loadMedia();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  // Handle media selection
  const handleMediaSelect = (mediaItem) => {
    setFormData({
      ...formData,
      imageUrl: mediaItem.url,
      altText: formData.altText || mediaItem.altText || mediaItem.name
    });
    setShowMediaLibrary(false);
    

