export const fetchProduct = async (id) => {
  try {
    const TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2MzI4NTM3MiwianRpIjoiNTc4ZTUzMGEtNTlhZC00MjNmLWIyNGEtMTUwZDdiOTZkMDQ0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NjMyODUzNzIsImNzcmYiOiJkZWI5NWNiNi04OGIwLTQzYWYtODczYi1kMDU2Yzk3OGM2ZWUiLCJleHAiOjE3NjMyODYyNzIsImlzQWRtaW4iOnRydWV9.mgBYKdf2GnCJ7eHOemP2IPFNQeAZY213JC5nB9d8jC4';

    const response = await fetch(`http://192.168.1.105:8000/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};
