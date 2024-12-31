"use client";

import { Navbar } from "@/components/landing/navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple-600 to-blue-600">
          Terms and Conditions
        </h1>
        <div className="prose prose-gray max-w-none">
          <div className="text-gray-600 text-lg space-y-6">
            <p>Last updated: December 31, 2024</p>

            <p>Please read these terms and conditions carefully before using Our Service.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Interpretation and Definitions</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Interpretation</h3>

            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Definitions</h3>

            <p>For the purposes of these Terms and Conditions:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Country</strong> refers to: Kosovo</li>
              <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Alignometrix, Rr. Bedri Shala.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
              <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
              <li><strong>Website</strong> refers to Alignometrix, accessible from <a href="https://www.alignometrix.com">https://www.alignometrix.com</a></li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>

            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>

            <ul className="list-disc pl-6">
              <li>By visiting this page on our website: <a href="https://www.alignometrix.com/contact">https://www.alignometrix.com/contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 