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
      <section className="mb-5 flex max-w-2xl flex-col items-center">
        <div className="mb-5 flex max-w-2xl flex-col gap-5">
          <h1>RTAI CHAT TERMS OF SERVICE</h1>
          <p>Last Updated: 2025-04-11</p>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>RTAi chat</strong> (<strong>“Service”</strong>),
            a chatbot platform developed and operated by an{" "}
            <strong>individual</strong> (“
            <strong>I</strong>”, “<strong>me</strong>”, or “<strong>my</strong>
            ”). This Service leverages various AI models and technologies,
            including but not limited to OpenAI, Claude, and Deepseek, to
            provide automated responses and facilitate interactive discussions.
            By accessing or using RTAi chat, you agree to comply with and be
            bound by these Terms of Service (“<strong>Terms</strong>”)
          </p>
          <p>
            If you do not agree with any part of these Terms, you must not
            access or use RTAi chat.
          </p>
          <h2>2. Eligibility</h2>
          <p>You may only use RTAi chat if:</p>
          <ol className="space-y-3 pl-2">
            <li>
              You are at least the age of majority in your jurisdiction; and
            </li>
            <li>
              You have the legal capacity and authority to enter into these
              Terms.
            </li>
          </ol>
          <p>
            By using RTAi chat, you represent and warrant that you meet all the
            eligibility criteria stated above.
          </p>
          <h2>3. Acceptance of Terms</h2>
          <p>
            By accessing or using RTAi chat, you confirm that you have read,
            understood, and agree to be bound by these Terms and all applicable
            laws. If you do not agree, you should immediately stop using the
            Service.
          </p>
          <h2>4. Modifications to the Terms</h2>
          <p>
            We reserve the right, in our sole discretion, to change, modify, or
            update these Terms at any time. When we do, we will post the updated
            Terms on our website or within the Service and update the “Last
            Updated” date at the top of this page. Your continued use of RTAi
            chat after any such changes constitute your acceptance of the
            revised Terms.
          </p>
          <h2>5. Description of the Service</h2>
          <p>
            <strong>5.1. General Functionality</strong> RTAi chat is an
            AI-powered chatbot that allows users to interact with artificial
            intelligence language models. It can provide responses to user
            queries, facilitate discussions, and offer information and ideas.
            However, RTAi chat is not a substitute for professional or expert
            advice.
          </p>
          <p>
            <strong>5.2. AI Outputs</strong> The responses and outputs provided
            by RTAi Chat are generated using large language models developed by
            various third-party providers. These outputs may not always be
            accurate, complete, or up-to-date. You acknowledge and agree that
            all AI-generated content is provided on an “as is” basis.
          </p>
          <p>
            <strong>5.3. Updates and Improvements</strong> We may, at our
            discretion and without obligation, update, improve, or change the
            functionality of RTAi chat. We do not guarantee that any specific
            feature or part of the Service will always be available.
          </p>
          <h2>6. User Conduct</h2>
          <p>When using RTAi chat, you agree NOT to:</p>
          <ol className="space-y-3 pl-2">
            <li>Violate any applicable laws, regulations, or these Terms.</li>
            <li>
              Use the Service for any unlawful, harmful, threatening, abusive,
              harassing, defamatory, or otherwise objectionable purpose.
            </li>
            <li>
              Attempt to gain unauthorized access to, interfere with, or disrupt
              any servers or networks connected to RTAi chat.
            </li>
            <li>
              Transmit viruses, malware, or other malicious code that could harm
              RTAi chat, other users, or third parties.
            </li>
            <li>Collect or harvest any personal data about other users.</li>
            <li>
              Use RTAi chat to generate or share content that infringes on any
              intellectual property or privacy rights of a third party.
            </li>
          </ol>
          <h2>7. Privacy</h2>
          <p>
            Your use of RTAi chat is also subject to our{" "}
            <strong>Privacy Policy</strong>, which describes how we collect,
            use, and protect your personal information. By using RTAi chat, you
            consent to all actions taken by us concerning your information in
            compliance with our Privacy Policy.
          </p>
          <h2>Intellectual Property</h2>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Ownership.</strong> The creator of RTAi Chat owns all
              rights, title, and interest in and to the platform, including any
              underlying software, technology, and content (excluding User
              Content).
            </li>
            <li>
              <strong>User Content License.</strong> By submitting or
              transmitting any content (“<strong>User Content</strong>”) to RTAi
              Chat, you grant the creator of RTAi Chat a non-exclusive,
              worldwide, royalty-free, sublicensable, and transferable license
              to store, display, process, and use your User Content in
              connection with providing and improving the Service.
            </li>
          </ol>
          <h2>9. Disclaimers</h2>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>No Warranty.</strong> The Service is provided on an “
              <strong>as is</strong>” and “<strong>as available</strong>” basis.{" "}
              <strong>
                To the fullest extent permitted by applicable law, we disclaim
                all warranties of any kind
              </strong>
              , whether express or implied, including but not limited to implied
              warranties of merchantability, fitness for a particular purpose,
              and non-infringement.
            </li>
            <li>
              <strong> Accuracy of Information.</strong> We do not guarantee the
              accuracy, completeness, or timeliness of any information or data
              provided by RTAi chat. Any reliance on such information is at your
              own risk.
            </li>
            <li>
              <strong>No Professional Advice.</strong> RTAi chat is not a
              substitute for professional advice (legal, medical, financial, or
              otherwise). Always seek the guidance of qualified professionals
              before making decisions based on the outputs generated by RTAi
              chat.
            </li>
          </ol>
          <h2>10. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law:</p>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>No Liability for Indirect Damages.</strong> The individual
              creator of RTAi Chat shall not be held liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              but not limited to loss of profits, data, use, or goodwill,
              arising out of or related to your use of RTAi Chat, even if
              advised of the possibility of such damages.
            </li>
            <li>
              <strong>Aggregate Liability Cap.</strong> In no event will Creator
              of RTAi Chat, total liability exceed the amount you paid us, if
              any, in the 12 months preceding the event giving rise to the
              liability or one hundred US dollars (USD $100), whichever is
              greater.
            </li>
          </ol>
          <h2>11. Indemnification</h2>
          <p>
            <strong>Indemnification.</strong> You agree to defend, indemnify,
            and hold harmless the individual creator of RTAi Chat from and
            against any and all claims, damages, liabilities, losses, costs, and
            expenses (including reasonable attorneys’ fees) arising out of or in
            any way connected with:
          </p>
          <ol className="space-y-2 pl-2">
            <li>Your use of RTAi chat or any activities under your account;</li>
            <li>Your breach or alleged breach of these Terms;</li>
            <li>Your violation of any law or the rights of a third party.</li>
          </ol>
          <h2>12. Third-Party Services</h2>
          <p>
            RTAi chat may integrate, incorporate, or otherwise link to
            third-party services or content. We do not endorse or assume
            responsibility for such third-party services. Your interactions with
            these third-party services are governed by their own terms and
            policies.
          </p>
          <h2>13. Term and Termination</h2>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Term.</strong> These Terms remain in effect as long as you
              use RTAi chat.
            </li>
            <li>
              <strong>Termination by You.</strong> You may stop using RTAi chat
              at any time.
            </li>
            <li>
              <strong>Termination by Us. </strong> We may suspend or terminate
              your access to RTAi chat at any time for any reason, including but
              not limited to violation of these Terms.
            </li>
            <li>
              <strong>Effect of Termination.</strong> Upon termination, your
              rights to use RTAi chat will immediately cease, and you must
              discontinue all use of the Service.
            </li>
          </ol>
          <h2>14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms and your use of RTAi Chat will be governed by and
            construed in accordance with the laws of Iraq. Any disputes arising
            out of or in connection with these Terms will be resolved
            exclusively in the courts located in Baghdad, Iraq, unless otherwise
            required by applicable law.
          </p>
          <h2>15. Changes to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue RTAi chat
            (in whole or in part) at any time, with or without notice to you. We
            will not be liable to you or any third party for any such
            modifications, suspension, or discontinuation.
          </p>
          <h2>16. Refund Policy</h2>
          <p>
            All purchases and payments made for access to RTAi Chat are final
            and non-refundable. As the Service is provided on an &quot;as
            is&quot; basis with immediate access to AI-generated outputs, we do
            not offer refunds or credits for any reason, including but not
            limited to dissatisfaction with the responses or accidental
            purchases. Please ensure that the Service meets your needs before
            making any payment.
          </p>
          <h2>17. General</h2>
          <ol className="space-y-3 pl-2">
            <li>
              <strong>Severability.</strong> If any provision of these Terms is
              found to be invalid or unenforceable, the remaining provisions
              will continue in full force and effect.
            </li>
            <li>
              <strong>Entire Agreement.</strong> These Terms, along with any
              other agreements referenced herein (including our Privacy Policy),
              constitute the entire agreement between you and the creator of
              RTAi Chat regarding your use of the service.
            </li>
            <li>
              <strong>No Waiver.</strong> Any failure by us to enforce any right
              or provision under these Terms does not constitute a waiver of
              future enforcement of that right or provision.
            </li>
            <li>
              <strong>Assignment.</strong> You may not assign or transfer these
              Terms or any rights or obligations herein without the prior
              written consent of the creator of RTAi Chat. We may freely assign
              or transfer these Terms.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
