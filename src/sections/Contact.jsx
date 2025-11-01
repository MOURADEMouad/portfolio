import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * The Contact section of the website allows users to
 * submit a message to the website owner. The component renders a form with
 * name, email, subject and message fields. When the form is submitted, the component
 * sends an email using EmailJS and displays a success or error message using SweetAlert2.
 */
const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [emailJSReady, setEmailJSReady] = useState(false);

  // Initialize EmailJS when component mounts
  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      window.emailjs.init("zSMQpt8BtLLC24vjR");
      setEmailJSReady(true);
    };
    document.head.appendChild(script);

    // Load SweetAlert2 script
    const sweetAlertScript = document.createElement('script');
    sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    sweetAlertScript.async = true;
    document.head.appendChild(sweetAlertScript);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (sweetAlertScript.parentNode) sweetAlertScript.parentNode.removeChild(sweetAlertScript);
    };
  }, []);

  /**
   * Handles the change of the form fields, updates the
   * component state with the new values.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /**
   * Handles the form submission, sends an email using EmailJS
   * and displays a success or error message using SweetAlert2.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailJSReady || !window.emailjs) {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'EmailJS n\'est pas encore chargé. Veuillez réessayer.',
        });
      }
      return;
    }

    try {
      setLoading(true);
      
      // Send email using EmailJS with all form data in message
      const result = await window.emailjs.send(
        'service_ghxiaer', // YOUR_SERVICE_ID
        'template_o1hikhi', // YOUR_TEMPLATE_ID
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: `
Nom: ${form.name}
Email: ${form.email}
Sujet: ${form.subject}

Message:
${form.message}
          `.trim()
        }
      );

      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: 'Message envoyé!',
          text: 'Votre message a bien été envoyé.',
        });
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error:', error);
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de l\'envoi : ' + JSON.stringify(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center mb-20 px-4" id="contact">
      <motion.div
        className="flex flex-col w-full max-w-7xl items-center justify-start"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="w-full text-left">
          <motion.h2
            className="mb-10 xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-black !leading-normal bg-gradient-to-l from-[#ff9720] to-[#fc0865] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Contactez-moi
          </motion.h2>
        </div>

        <div className="flex w-full max-w-lg bg-[#32303a] sm:p-8 p-6 rounded-xl text-white">
          <form
            ref={formRef}
            className="flex flex-col gap-6 w-full"
            onSubmit={handleSubmit}
            id="contactForm"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Nom</span>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="py-3 px-4 bg-[#46454d] rounded-lg text-white outline-none focus:ring-2 focus:ring-[#ff9720]"
                placeholder="Votre nom"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Adresse e-mail</span>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="py-3 px-4 bg-[#46454d] rounded-lg text-white outline-none focus:ring-2 focus:ring-[#ff9720]"
                placeholder="Votre email"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Sujet</span>
              <input
                type="text"
                name="subject"
                id="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="py-3 px-4 bg-[#46454d] rounded-lg text-white outline-none focus:ring-2 focus:ring-[#ff9720]"
                placeholder="Sujet du message"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Message</span>
              <textarea
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="py-3 px-4 bg-[#46454d] rounded-lg text-white resize-none min-h-[120px] outline-none focus:ring-2 focus:ring-[#ff9720]"
                placeholder="Votre message"
              />
            </label>

            <div className="flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={loading || !emailJSReady}
                className="bg-gradient-to-r from-[#ff9720] to-[#fc0865] py-3 px-8 outline-none w-fit text-white font-bold shadow-md rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;