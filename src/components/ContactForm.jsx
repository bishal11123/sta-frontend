// src/components/ContactForm.jsx
const ContactForm = () => (
  <section id="contact" className="bg-gray-100 py-16 px-6">
    <div className="max-w-xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
      <form className="space-y-6">
        {['Name', 'Email', 'Message'].map((label, i) => (
          <div key={i} className="relative">
            <input
              type={label === 'Message' ? 'textarea' : 'text'}
              required
              className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm peer-focus:text-xs peer-focus:top-1 peer-focus:text-purple-600 transition-all">
              {label}
            </label>
          </div>
        ))}
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
          Send Message
        </button>
      </form>
    </div>
  </section>
);
export default ContactForm;
