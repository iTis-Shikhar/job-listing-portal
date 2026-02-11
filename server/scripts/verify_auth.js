const API_URL = 'http://localhost:5000/api';

const testAuth = async () => {
    try {
        // 1. Register
        const uniqueSuffix = Date.now();
        const user = {
            name: `Test User ${uniqueSuffix}`,
            email: `test${uniqueSuffix}@example.com`,
            password: 'password123'
        };

        console.log('1. Registering user...', user);
        let response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        
        let data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        console.log('Registration successful:', data);
        const token = data.token;

        // 2. Login
        console.log('\n2. Logging in...');
        response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        console.log('Login successful:', data);

        // 3. Get Profile
        console.log('\n3. Fetching profile...');
        response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Profile fetch failed');
        console.log('Profile fetch successful:', data);

        console.log('\nVerification PASSED!');
    } catch (error) {
        console.error('\nVerification FAILED:', error.message);
    }
};

testAuth();
