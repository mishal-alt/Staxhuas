const testRequest = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'interviewer@staxhaus.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      return;
    }

    const token = loginData.data?.accessToken || loginData.accessToken;
    console.log('Login successful. Token:', token ? 'Found' : 'Not found');

    // 2. Fetch interviews
    console.log('Fetching interviews...');
    const interviewsRes = await fetch('http://localhost:5000/api/interviews', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const interviewsData = await interviewsRes.json();
    console.log('Interviews Response:', JSON.stringify(interviewsData, null, 2));

  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

testRequest();
