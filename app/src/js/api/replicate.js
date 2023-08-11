const replicateAccessToken = process.env.REPLICATE_API_KEY;
const replicateApiUrl = 'https://api.replicate.com/v1';

if (!replicateAccessToken) {
    console.log('Please set your REPLICATE_API_KEY environment variable and try again.')
}

/**
 * Helper function to make REPLICATE API calls
 */
const replicateApiFetch = async (path, options = {}) => {

    let data = {}
    let response = { status: 0 }

    if (replicateAccessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Token ${replicateAccessToken}`,
      };

      console.log(`Calling ${replicateApiUrl}/${path}`, options)
      response = await fetch(`${replicateApiUrl}/${path}`, options);
      data = await response.json();
      console.log('Got', data)
    }
  
    if (response.ok && (response.status === 200 || response.status === 201)) {
      return data;
    } else {
      error = `[REPLICATE] ${response.status}: ${data.message}`
      console.error(`Error calling ${path}`, data.message);
    }
  };
  
  /**
   * Replicate API POST request
   */
  const replicateApiPost = async (path, body) =>
    replicateApiFetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
  
  /**
   * Replicate API GET request
   */
  const replicateApiGet = async (path) => replicateApiFetch(path, {});