import "../styles/admin-home.scss";
import TraducteurComponent from "../components/ListTraducteurs";
import ClientsComponent from "../components/ListClients";

export default function HomeAdmin() {
  return (
    <div className="admin-container">
      <section className="home-header-section">
        <div>
          <h4>Listes des traducteurs</h4>
          <TraducteurComponent />
        </div>
      </section>
      <section className="home-header-section">
        <div>
          <h4>Listes des clients</h4>
          <ClientsComponent />
        </div>
      </section>
    </div>
  );
}
