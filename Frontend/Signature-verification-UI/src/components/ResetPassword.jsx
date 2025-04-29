import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:4000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Reset Password</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
