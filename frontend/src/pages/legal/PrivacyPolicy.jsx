import React from 'react';

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto p-8 text-gray-800">
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p className="mb-4">Last Updated: January 2026</p>
    
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
      <p>We collect information you provide via Social Login (Google, X, Instagram, TikTok), including your name, email address, and profile identifiers to provide CRM services.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. How We Use Data</h2>
      <p>Your data is used solely to manage your contacts and social interactions within the YouTool platform. We do not sell your personal data to third parties.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Third-Party Services</h2>
      <p>By using YouTool, you agree to the privacy policies of our authentication providers (Google, Meta, X, and TikTok).</p>
    </section>
  </div>
);

export default PrivacyPolicy;