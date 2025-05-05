import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'di3080afu';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = 'car_rental_unsigned';

const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 10MB.');
  }
};

export const uploadImage = async (file, onProgress) => {
  try {
    validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'car_rental');
    // Only include allowed parameters for unsigned upload
    formData.append('tags', 'car_rental');
    formData.append('context', 'source=car_rental_app');

    const response = await axios.post(CLOUDINARY_URL, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(percentCompleted);
      },
    });

    if (!response.data.secure_url) {
      throw new Error('No secure URL returned from Cloudinary');
    }

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const uploadMultipleImages = async (files, onProgress) => {
  try {
    const totalFiles = files.length;
    let completedFiles = 0;

    // Validate all files first
    Array.from(files).forEach(validateFile);

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const url = await uploadImage(file, (progress) => {
          const totalProgress = ((completedFiles * 100) + progress) / totalFiles;
          onProgress?.(Math.round(totalProgress));
        });
        completedFiles++;
        return url;
      } catch (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error(error.message || 'Failed to upload images');
  }
}; 