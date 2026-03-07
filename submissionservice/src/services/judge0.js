
const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SubmitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: `${process.env.JUDGE0_HOST}/submissions/batch`,
    params: { base64_encoded: 'true' },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      'x-rapidapi-host': process.env.JUDGE0_HOST_NAME || 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: { submissions }
  };

  try {
    const response = await axios.request(options);
    console.log('Batch submission response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in SubmitBatch:', error.response?.data || error.message);
    throw error;
  }
}

const SubmitToken = async (tokens) => {
  const options = {
    method: 'GET',
    url: `${process.env.JUDGE0_HOST}/submissions/batch`,
    params: {
      tokens: tokens.join(","),
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      'x-rapidapi-host': process.env.JUDGE0_HOST_NAME || 'judge0-ce.p.rapidapi.com'
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error('Error in SubmitToken fetchData:', error.response?.data || error.message);
      return null;
    }
  }

  while (true) {
    const result = await fetchData();
    if (result && result.submissions) {
      const allProcessed = result.submissions.every((res) => res.status_id > 2);
      if (allProcessed) return result.submissions;
    }
    await sleep(2000); 
  }
}

module.exports = { SubmitBatch, SubmitToken };
