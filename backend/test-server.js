const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Express Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test transactions endpoint
    console.log('\n2. Testing transactions endpoint...');
    const transactionsResponse = await axios.get(`${BASE_URL}/api/transactions`);
    console.log('✅ GET /api/transactions passed:', transactionsResponse.data);

    // Test creating a transaction
    console.log('\n3. Testing transaction creation...');
    const newTransaction = {
      amount: 100.50,
      date: '2024-01-15',
      description: 'Test transaction',
      type: 'expense'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/transactions`, newTransaction);
    console.log('✅ POST /api/transactions passed:', createResponse.data);

    // Test updating a transaction
    console.log('\n4. Testing transaction update...');
    const updateData = {
      _id: createResponse.data._id,
      amount: 150.00,
      date: '2024-01-15',
      description: 'Updated test transaction',
      type: 'expense'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/api/transactions`, updateData);
    console.log('✅ PUT /api/transactions passed:', updateResponse.data);

    // Test deleting a transaction
    console.log('\n5. Testing transaction deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/transactions`, {
      data: { _id: createResponse.data._id }
    });
    console.log('✅ DELETE /api/transactions passed:', deleteResponse.data);

    console.log('\n🎉 All backend tests passed!');
    console.log('✅ Express server is working correctly');
    console.log('✅ MongoDB connection is successful');
    console.log('✅ All CRUD operations are functional');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('1. The backend server is running (npm run dev)');
    console.log('2. MongoDB connection string is correct');
    console.log('3. Port 5000 is available');
  }
}

testBackend(); 