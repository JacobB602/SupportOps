import { useEffect, useState } from "react";

function Layout() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>SupportOps</h1>
        <div className="header-user">Support Agent</div>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          <div className="sidebar-item">Dashboard</div>
          <div className="sidebar-item">Tickets</div>
          <div className="sidebar-item">Incidents</div>
          <div className="sidebar-item">Users</div>
          <div className="sidebar-item">Organizations</div>
        </nav>

        <main className="main-content">
          <h2>Support Dashboard</h2>

          <h3>Tickets</h3>

          {tickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id}>
                <strong>{ticket.title}</strong>
                <p>{ticket.description}</p>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default Layout;