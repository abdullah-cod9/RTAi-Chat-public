import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="mt-5 flex h-screen w-full flex-col items-center space-y-5 overflow-y-auto p-2 px-3 text-foreground/90">
      <section className="w-full">
        <div className="flex w-full flex-col items-center justify-between p-4 sm:flex-row">
          <Link prefetch href={"/chat"}>
            <h2>RTAi chat</h2>
          </Link>
          <div className="flex gap-4">
            <Link prefetch href={"/terms-of-service"}>
              <h4>Terms of Service</h4>
            </Link>
            <Link prefetch href={"/privacy-policy"}>
              <h4>Privacy Policy</h4>
            </Link>
            <Link prefetch href={"/security-policy"}>
              <h4>Security Policy</h4>
            </Link>
          </div>
        </div>
      </section>
      <section className="mb-5 flex max-w-2xl flex-col items-center gap-5">
        <div className="mb-5 flex max-w-2xl flex-col gap-5">
          <h1>RTAI CHAT SECURITY POLICY</h1>
          <p>Last Updated: 2025-04-11</p>
          <h2>1. Introduction</h2>
          <p>
            RTAi Chat is committed to ensuring the security of our users&apos;
            data and our platform. This security policy outlines our practices
            and procedures for maintaining security.
          </p>
          <h2>2. Reporting Security Issues</h2>
          <p>
            We welcome security researchers, ethical hackers, and technology
            enthusiasts to participate in our responsible disclosure program. We
            provide safe harbor for security testing conducted in good faith and
            may offer rewards for vulnerability discoveries based on severity
            and potential impact.
          </p>
          <p>
            If you discover a security vulnerability, please report it
            immediately to{" "}
            <Link
              href={"mailto:support@rtai.chat"}
              className="text-primary underline"
            >
              support@rtai.chat
            </Link>
            . Include:
          </p>
          <ul className="space-y-3 pl-2">
            <li>A detailed description of the vulnerability</li>
            <li>Clear steps to reproduce the issue</li>
            <li>Any relevant screenshots, logs, or proof-of-concept code</li>
            <li>Potential impact assessment</li>
            <li>Your contact information for follow-up</li>
          </ul>
          <p>We commit to:</p>
          <ul className="space-y-3 pl-2">
            <li>Acknowledging receipt within 1 business day</li>
            <li>Working with you to validate and resolve the issue</li>
            <li>Giving appropriate credit if desired</li>
          </ul>
          <p>
            We value the security community&apos;s contributions in keeping RTAi
            chat secure. All legitimate reports will be thoroughly investigated
            and addressed with appropriate urgency.
          </p>
          <h2>3. Our Security Practices</h2>
          <h3>3.1. Data Protection</h3>
          <ul className="space-y-3 pl-2">
            <li>All data is encrypted in transit using TLS</li>
            <li>
              We collect only essential user information, adhering to data
              minimization principles
            </li>
            <li>
              User data is stored securely with appropriate access controls
            </li>
          </ul>
          <h3>3.2. Authentication</h3>
          <ul className="space-y-3 pl-2">
            <li>Industry-standard authentication protocols</li>
            <li>Secure session management</li>
          </ul>
          <h3>3.3. Infrastructure</h3>
          <ul className="space-y-3 pl-2">
            <li>Regular security audits and assessments</li>
            <li>Regular security updates and patches</li>
            <li>Monitoring for suspicious activities</li>
          </ul>
          <h2>4. User Responsibilities</h2>
          <p>To help maintain the security of your account:</p>
          <ul className="space-y-3 pl-2">
            <li>Use secure authentication providers you trust</li>
            <li>
              Keep your OAuth provider account secure with strong passwords and
              two-factor authentication
            </li>
            <li>Never share access to your authorized RTAi chat sessions</li>
            <li>Report suspicious activities immediately</li>
          </ul>
          <h2>5. Updates to This Policy</h2>
          <p>
            We may update this Security Policy from time to time. When we do, we
            will revise the &quot;Last Updated&quot; date at the top of this
            page.
          </p>
        </div>
      </section>
    </div>
  );
}
