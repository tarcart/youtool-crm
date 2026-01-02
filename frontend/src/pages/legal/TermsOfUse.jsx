import React from 'react';

const TermsOfUse = () => (
  <div className="max-w-4xl mx-auto p-8 text-gray-800">
    <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
    <p className="mb-4">Welcome to YouTool.</p>
    
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p>By accessing YouTool, you agree to be bound by these terms and all applicable laws and regulations.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
      <p>You are granted permission to use the software for personal or business CRM purposes. Unauthorized scraping or misuse of the API is prohibited.</p>
    </section>
  </div>
);

export default TermsOfUse;