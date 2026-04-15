const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl mt-7 font-bold mb-2 text-foreground">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground mb-8">Effective Date: June 2024</p>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <p>
          Welcome to <strong>Snap Gen AI</strong> (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;). This Privacy Policy explains how
          we collect, use, and protect your information when you use our
          AI-powered image generation platform.
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            1. Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                a. Personal Information
              </h3>
              <p>When you sign up or use our services, we may collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Account credentials</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">b. Usage Data</h3>
              <p>We automatically collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Prompts you submit for image generation</li>
                <li>Generated images</li>
                <li>IP address</li>
                <li>Browser type and device information</li>
                <li>Usage activity (credits usage, login activity)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                c. Payment Information
              </h3>
              <p>
                We use <strong>Stripe</strong> to process payments. We do{" "}
                <strong>not</strong> store your card details. Payment data is
                securely handled by Stripe.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            2. How We Use Your Information
          </h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and maintain our services</li>
            <li>Process transactions and manage credits</li>
            <li>Improve AI performance and user experience</li>
            <li>Prevent fraud and abuse</li>
            <li>Communicate important updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            3. AI Processing & Third-Party Services
          </h2>
          <p>
            Our platform uses <strong>Replicate</strong> to generate images
            based on your prompts. By using our service:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your prompts may be sent to Replicate for processing</li>
            <li>
              Generated outputs may be temporarily stored for performance and
              history features
            </li>
          </ul>
          <p className="mt-4">
            We ensure third-party providers follow reasonable security and
            privacy standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            4. Data Retention
          </h2>
          <p>
            We retain your data only as long as necessary to provide services,
            comply with legal obligations, and resolve disputes. You may request
            deletion of your account and data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            5. Cookies & Tracking Technologies
          </h2>
          <p>
            We use cookies to maintain user sessions, improve user experience,
            and analyze platform usage. You can disable cookies in your browser
            settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            6. Data Security
          </h2>
          <p>
            We implement industry-standard measures to protect your data,
            including secure HTTPS connections and encrypted storage where
            applicable. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            7. User Rights
          </h2>
          <p>
            Depending on your location, you may have rights to access, correct,
            delete, or object to certain processing of your data. To exercise
            these rights, contact us at: <strong>support@snapgenai.com</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Our service is not intended for users under the age of 13. We do not
            knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </p>
        </section>

        <section className="pt-8 border-t border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            10. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> support@snapgenai.com
          </p>
          <p>
            <strong>Website:</strong> https://snapgenai.com
          </p>
        </section>

        <section className="p-4 bg-muted rounded-lg text-sm italic text-muted-foreground">
          <strong>Disclaimer:</strong> Generated images are created using AI
          models and may not always be accurate, appropriate, or unique. Users
          are responsible for how they use generated content.
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
