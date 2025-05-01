import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddTurfSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Turf Submitted!</h1>
      <p className="mb-6 text-center">Your turf has been submitted for approval. Please wait for admin review.</p>
      <button
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
        onClick={() => navigate('/manager/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AddTurfSuccessPage;
