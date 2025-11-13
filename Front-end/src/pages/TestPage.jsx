import React from 'react';
import ApiTest from '@/Components/Test/ApiTest';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">API Testing Page</h1>
        <ApiTest />
      </div>
    </div>
  );
};

export default TestPage;
