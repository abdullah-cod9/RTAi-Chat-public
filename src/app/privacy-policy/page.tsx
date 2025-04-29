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
          <h1>RTAI CHAT PRIVACY POLICY</h1>
          <p>Last Updated: 2025-04-11</p>
          <h2>1. Introduction</h2>
          <p>
            Welcome to RTAi Chat, a chatbot service developed and operated by
            ABDULLAH BASIM ABBAS. This Privacy Policy outlines how I collect,
            use, disclose, and protect your personal information when you access
            or use RTAi Chat. By accessing or using RTAi Chat, you agree to the
            terms of this Privacy Policy.
          </p>
          <h2>2. Information We Collect</h2>
          <h3>2.1. Information You Provide</h3>
          <ul className="space-y-3 pl-2">
            <li>
              <strong>Account Information:</strong> If you create an account or
              register for RTAi chat (where applicable), we may collect certain
              details such as your name, email address, username, or other
              identifying information.
            </li>
            <li>
              <strong>User Content:</strong> We collect the queries, messages,
              and other content (“User Content”) you submit when interacting
              with RTAi chat.
            </li>
          </ul>
          <h3>2.2. Information Collected Automatically</h3>
          <ul className="space-y-3 pl-2">
            <li>
              <strong>Usage Data:</strong> We may collect information about how
              you interact with RTAi chat, such as the features you use, the
              date and time of your visits, and other similar details.
            </li>
            <li>
              <strong>Device and Connection Information:</strong> We may collect
              information about the device you use to access RTAi chat (e.g., IP
              address, operating system, browser type, device identifiers).
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We may use
              cookies, web beacons, and similar tracking technologies to collect
              information about your usage of RTAi chat and to provide a more
              personalized experience.
            </li>
          </ul>
          <h2>3. How We Use Your Information</h2>
          <p>
            We use the personal information we collect for various purposes,
            including:
          </p>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Providing and Improving the Service:</strong> To process
              your requests, provide chatbot responses, maintain and enhance
              RTAi chat’s functionality, and develop new features.
            </li>
            <strong>Personalization:</strong> To customize your experience, such
            as tailoring recommendations or content based on your usage
            patterns.
            <li>
              <strong>Analytics and Performance:</strong> To analyze usage
              patterns, diagnose technical issues, and improve the overall
              performance and security of RTAi chat.{" "}
            </li>
            <li>
              <strong>Communication:</strong> To send you updates, respond to
              your inquiries, and provide customer support.
            </li>
            <li>
              <strong>Legal and Compliance:</strong> To comply with applicable
              laws, regulations, or legal obligations and to enforce our Terms
              of Service or other agreements.
            </li>
          </ol>
          <h2>4. Disclosure of Your Information</h2>
          <p>
            We do not sell or rent your personal information. However, we may
            share your information in the following circumstances:
          </p>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Service Providers:</strong> We may share your information
              with third-party service providers who perform services on our
              behalf (e.g., hosting, analytics, customer support). These service
              providers are authorized to use your information only as necessary
              to provide services to us.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event that RTAi Chat,
              or substantially all of its assets, are transferred to another
              individual or entity (for example, as part of a sale or other
              transfer of ownership), your personal information may be included
              in the transferred assets, subject to reasonable confidentiality
              obligations.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information to law enforcement, government authorities, or other
              third parties when we are legally compelled to do so, or when we
              believe it is necessary to comply with legal obligations, protect
              our rights and property, or respond to an emergency.
            </li>
            <li>
              <strong>Consent:</strong> We may share your information for any
              other purpose disclosed to you at the time we collect the
              information or pursuant to your consent.
            </li>
          </ol>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as it is necessary
            to fulfill the purposes for which it was collected, or as required
            by applicable laws and regulations. When we no longer need your
            personal information, we will take reasonable steps to securely
            delete or de-identify it.
          </p>
          <h2>6. Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical
            safeguards to protect your personal information from unauthorized
            access, use, alteration, or destruction. However, no method of data
            transmission or storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
          <h2>7. International Data Transfers</h2>
          <p>
            International Data Transfers RTAi Chat is operated by an individual
            based in Iraq. Please note that your personal information may be
            transferred to, stored, and processed in countries other than your
            own, including jurisdictions where data protection laws may differ
            from those in your country. When we transfer personal data, we take
            reasonable steps to ensure it is protected in accordance with this
            Privacy Policy and applicable data protection laws.
          </p>
          <h2>8. Children’s Privacy</h2>
          <p>
            RTAi chat is not intended for use by individuals under the age of
            <strong>18</strong>, and we do not knowingly collect personal
            information from children. If you believe that we have inadvertently
            collected personal information from a child, please contact us, and
            we will take steps to delete the information as soon as possible.
          </p>
          <h2>9. Your Rights and Choices</h2>
          <p>
            Depending on your jurisdiction, you may have certain rights
            regarding your personal information, such as:
          </p>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Access:</strong> Request to access or obtain a copy of the
              personal information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request to correct or update
              inaccurate or incomplete personal information.
            </li>
            <li>
              <strong>Deletion:</strong> Request to delete your personal
              information.
            </li>
            <li>
              <strong>Restriction:</strong> Request to restrict the processing
              of your personal information.
            </li>
            <li>
              <strong>Objection:</strong> Object to certain processing
              activities or withdraw your consent (where applicable).
            </li>
            <li>
              <strong>Portability:</strong> Request to obtain a copy of your
              personal information in a structured, commonly used, and
              machine-readable format.
            </li>
          </ol>
          <p>
            To exercise any of these rights or to make another privacy-related
            request, please contact us using the information below. We will
            respond within a reasonable timeframe, in accordance with applicable
            laws.
          </p>
          <p>
            You can contact us at:{" "}
            <Link
              href={"mailto:support@rtai.chat"}
              className="text-primary underline"
            >
              support@rtai.chat
            </Link>
          </p>
          <h2>10. Third-Party Links and Services</h2>
          <p>
            RTAi chat may contain links to or integrations with third-party
            websites or services. We are not responsible for the privacy
            practices of these third parties, and this Privacy Policy does not
            apply to any information that you provide to them. We encourage you
            to review the privacy policies of these third-party websites or
            services before providing any personal information.
          </p>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technologies, legal requirements, or other
            factors. When we do, we will revise the “Last Updated” date at the
            top of this page. If we make significant changes, we will provide
            more prominent notice (e.g., via email or through a notice in the
            Service). Your continued use of RTAi Chat after any such changes
            constitutes your acceptance of the revised Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
}
