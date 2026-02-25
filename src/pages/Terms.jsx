import { useState, useEffect } from 'react'
import Button from '../components/Button'

const Terms = () => {
  const [settings, setSettings] = useState({
    companyName: 'Pencilz + Friends',
    email: 'hello@pencilz.works',
    location: 'Montreal'
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen px-5 py-14">
      <div className="max-w-[1004px]">
        <h1 className="text-[32px] text-[#191919] mb-16">Terms & Conditions</h1>
        
        <p className="text-[20px] text-[#191919] mb-20">
          <span className="font-medium">Last Updated: </span>
          <span>January 2026</span>
        </p>

        <div className="text-[32px] text-[#191919] space-y-0">
          <p className="font-medium mb-0">1. Introduction</p>
          <p className="mb-0">Welcome to {settings.companyName} ("we," "our," or "us"). By accessing or using our website located at [Website URL] (the "Site"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must not use our Site.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">2. Use of the Site</p>
          <p className="mb-0">The primary purpose of our Site is to provide information about our digital agency services and to collect contact information (such as email addresses) from interested parties. You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Site.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">3. Intellectual Property</p>
          <p className="mb-0">All content published and made available on our Site is the property of {settings.companyName} and the Site's creators. This includes, but is not limited to, images, text, logos, documents, downloadable files, and anything that contributes to the composition of our Site. You may not reproduce, distribute, or use these materials without our written consent.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">4. User Data and Privacy</p>
          <p className="mb-0">We collect personal information (specifically email addresses) through forms on our Site. By submitting your email address, you agree to receive communications from us regarding our services.</p>
          <p className="mb-0">Your submission of personal information is governed by our Privacy Policy. Please review our Privacy Policy [Link to Privacy Policy] to understand how we collect, use, and protect your data.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">5. Limitation of Liability</p>
          <p className="mb-0">{settings.companyName} and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities, and expenses including legal fees from your use of the Site.</p>
          <p className="mb-0">We do not guarantee that the Site will be secure or free from bugs or viruses. You are responsible for configuring your information technology, computer programmes, and platform to access our Site.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">6. Third-Party Links</p>
          <p className="mb-0">Our Site may contain links to third-party websites or services that we do not own or control. We are not responsible for the content, policies, or practices of any third-party website or service linked to on our Site. It is your responsibility to read the terms and conditions and privacy policies of these third-party websites before using these sites.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">7. Changes to These Terms</p>
          <p className="mb-0">We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date at the top. You are advised to review this page periodically for any changes. Your continued use of the Site after changes are posted constitutes your acceptance of the new Terms.</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">8. Governing Law</p>
          <p className="mb-0">These Terms are governed by the laws of [Your Country/State/Province]. Any disputes arising out of or in relation to these Terms will be subject to the jurisdiction of the courts of [Your Country/State/Province].</p>
          <p className="mb-0">&nbsp;</p>

          <p className="font-medium mb-0">9. Contact Us</p>
          <p className="mb-0">If you have any questions or concerns about these Terms, please contact us at:</p>
          <ul className="list-disc ml-12">
            <li>Email: {settings.email}</li>
            <li>Address: {settings.location}</li>
          </ul>
        </div>

        <div className="mt-32 text-center">
          <p className="text-[24px] text-black mb-12">Start a project</p>
          <Button
            href={`mailto:${settings.email}`}
            variant="primary"
            className="min-w-[481px]"
          >
            {settings.email}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Terms
