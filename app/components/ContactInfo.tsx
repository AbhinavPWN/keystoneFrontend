export default function ContactInfo() {
  return (
    <section  id="contact-info" className="py-12 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-[playfair] text-center">
          Contact Us
        </h2>
        <p className="mt-2 text-sm md:text-base text-center font-[roboto] ">
          Visit us at our office or get in touch today!
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Details */}
          <div className="space-y-4 font-[roboto] ">
            <p>📍 <strong>Address:</strong> Pulchowk, Narayanghad, Nepal</p>
            <p>
            📞 <strong>Phone:</strong>{' '}
            <a href="tel:+97714412345" className="text-orange-500 hover:underline">
                +977-9769385494
            </a>
            </p>

            <p>
            📧 <strong>Email:</strong>{' '}
            <a href="mailto:info@keystone.com.np" className="text-orange-500 hover:underline">
                kmcgroup2080@gmail.com
            </a>
            </p>

            <p>
              Our team is happy to assist you with any inquiries regarding our services, investments, or opportunities.
            </p>
          </div>

          {/* Map */}
          <div className="w-full">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3532.643134305982!2d84.419744!3d27.6974226!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb224c79fd03%3A0x737835fc6d7dca86!2sPulchowk!5e0!3m2!1sen!2snp!4v1752230254369!5m2!1sen!2snp" 
                width="100%"
                height="300"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded shadow"
                />
          </div>
        </div>
      </div>
    </section>
  );
}
