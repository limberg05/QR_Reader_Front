export const fetchProduct = async (id) => {
  try {
    const TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2MzI4NDM1NCwianRpIjoiMzg2YzUxMTQtNjAzNy00NjJiLWE3NGYtNjcxZTBmMjhjN2FmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NjMyODQzNTQsImNzcmYiOiIxZjVlNjAwNC1hM2RhLTQ4NDQtOGNkZC03MDI4YjM4YmVhOGEiLCJleHAiOjE3NjMyODUyNTQsImlzQWRtaW4iOnRydWV9.1XVml5ULn2952OpBooJRUp_uOkrYEGn6u0yW44hsoqc';

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
