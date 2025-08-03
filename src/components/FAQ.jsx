// src/components/FAQ.jsx
import { useState } from 'react';

const faqs = [
  {
    q: 'How long is the Japanese language course?',
    a: 'Usually 3 months before applying for visa.',
  },
  {
    q: 'Is there a visa guarantee?',
    a: 'We guide you to maximize your chances, but visa is granted by the embassy.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
        {faqs.map((item, i) => (
          <div key={i} className="border-b py-4">
            <button
              onClick={() => toggleFAQ(i)}
              className="w-full text-left text-lg font-medium text-purple-700 hover:text-purple-900 transition-all"
            >
              {item.q}
            </button>
            {openIndex === i && <p className="mt-2 text-gray-600">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
