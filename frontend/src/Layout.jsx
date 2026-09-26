import { useEffect, useState } from "react";

function Layout() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P3");

  const createTicket = async () => {
    try {
      const response = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
        }),
      });

      const newTicket = await response.json();

      setTickets((currentTickets) => [newTicket, ...currentTickets]);

      setTitle("");
      setDescription("");
      setPriority("P3");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

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

          <h3>Create Ticket</h3>

          <input
            type="text"
            placeholder="Ticket title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            placeholder="Ticket description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>

          <button onClick={createTicket}>Create Ticket</button>

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