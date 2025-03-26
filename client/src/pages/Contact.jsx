import "../styles/ContactForm.scss";
import contactImg from "../assets/images/contact.jpg";
import { toast, ToastContainer } from "react-toastify";

function ContactForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    setTimeout(() => {
      toast("message envoyé");
    }, 2000);
  };

  return (
    <>
      <img src={contactImg} alt="Contact" className="contact-image" />
      <div className="container_contact">
        <h1 className="title_contact">Contactez votre Agence de traduction</h1>
        <p className="p_contact">
          N'hésitez pas à nous contacter via l'un des moyens ci-dessous, et
          notre équipe se fera un plaisir de vous aider.
        </p>
        <form className="ContactForm" onSubmit={handleSubmit}>
          <input
            className="inputContact"
            type="text"
            minLength="5"
            id="Name"
            placeholder="Nom"
            required
          />
          <input
            className="inputContact"
            type="text"
            minLength="5"
            id="Prenom"
            placeholder="Prénom"
            required
          />
          <input
            className="inputContact"
            type="email"
            id="email"
            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
            placeholder="Email"
            required
          />
          <input
            className="inputContact"
            type="tel"
            placeholder="Numéro de téléphone"
            required
          />
          <textarea
            className="textareaContact"
            placeholder="Votre message"
            required
          />
          <button className="contactButton" type="submit">
            Envoyer votre message
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default ContactForm;
