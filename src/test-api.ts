// Test API connection
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function testAPIConnection() {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/student/enrollments.php?student_id=1`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    return {
      success: true,
      message: 'API connection successful',
      data
    };
  } catch (error) {
    console.error('API Connection Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'API connection failed',
      error
    };
  }
}
