// Reverse Geocoding Utility
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    // Construct a readable address
    const address = data.display_name || 'Address not found';
    
    return {
      formattedAddress: address,
      rawAddress: data.address || {},
      displayName: data.display_name
    };
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return {
      formattedAddress: 'Unable to retrieve address',
      rawAddress: {},
      displayName: ''
    };
  }
};

// Function to get current location with address
export const getCurrentLocationWithAddress = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const addressInfo = await reverseGeocode(latitude, longitude);
          
          resolve({
            lat: latitude,
            lng: longitude,
            ...addressInfo
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Optional: Function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

function deg2rad(deg) {
  return deg * (Math.PI/180);
}