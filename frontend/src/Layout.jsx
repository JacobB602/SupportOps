import { useEffect, useState } from "react";

function Layout() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P3");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("P3");

  // Navigation state
  const [activePage, setActivePage] = useState("Dashboard");

  // Organization state
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationLoading, setOrganizationLoading] = useState(false);
  const [organizationError, setOrganizationError] = useState("");

  // Create a ticket
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
          userId: selectedUserId ? Number(selectedUserId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const newTicket = await response.json();

      setTickets((currentTickets) => [newTicket, ...currentTickets]);

      setTitle("");
      setDescription("");
      setPriority("P3");
      setSelectedUserId("");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  // Update a ticket's status
  const updateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tickets/${ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }

      const updatedTicket = await response.json();

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );

      setSelectedTicket((currentTicket) =>
        currentTicket?.id === updatedTicket.id
          ? updatedTicket
          : currentTicket
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  // Start editing a ticket
  const startEditingTicket = () => {
    setEditTitle(selectedTicket.title);
    setEditDescription(selectedTicket.description ?? "");
    setEditPriority(selectedTicket.priority);
    setIsEditingTicket(true);
  };

  // Save ticket edits
  const saveTicketEdits = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/tickets/${selectedTicket.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            priority: editPriority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save ticket edits");
      }

      const updatedTicket = await response.json();

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );

      setSelectedTicket(updatedTicket);
      setIsEditingTicket(false);
    } catch (error) {
      console.error("Error saving ticket edits:", error);
    }
  };

  // Load all tickets when the application starts
  useEffect(() => {
    fetch("http://localhost:3000/tickets")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        return response.json();
      })
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  // Load all users when the application starts
  useEffect(() => {
    const loadUsers = async () => {
      setUserLoading(true);
      setUserError("");

      try {
        const response = await fetch("http://localhost:3000/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserError("Could not load callers. Check that the backend is running.");
      } finally {
        setUserLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Load all organizations
  const loadOrganizations = async () => {
    setOrganizationLoading(true);
    setOrganizationError("");

    try {
      const response = await fetch("http://localhost:3000/organizations");

      if (!response.ok) {
        throw new Error("Failed to load organizations");
      }

      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizationError(
        "Could not load organizations. Make sure the backend is running."
      );
    } finally {
      setOrganizationLoading(false);
    }
  };

  // Load an organization's schools and users
  const loadOrganizationDetails = async (organizationId) => {
    setOrganizationLoading(true);
    setOrganizationError("");
    setSelectedOrganization(null);

    try {
      const response = await fetch(
        `http://localhost:3000/organizations/${organizationId}/details`
      );

      if (!response.ok) {
        throw new Error("Failed to load organization details");
      }

      const data = await response.json();
      setSelectedOrganization(data);
    } catch (error) {
      console.error("Error fetching organization details:", error);
      setOrganizationError("Could not load organization details.");
    } finally {
      setOrganizationLoading(false);
    }
  };

  // Navigate between sections
  const navigateToPage = (page) => {
    setActivePage(page);
    setSelectedOrganization(null);
    setSelectedTicket(null);
    setIsEditingTicket(false);

    if (page === "Organizations") {
      loadOrganizations();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SupportOps</h1>
        <div className="header-user">Support Agent</div>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          {["Dashboard", "Tickets", "Incidents", "Users", "Organizations"].map(
            (page) => (
              <div
                key={page}
                className={`sidebar-item ${
                  activePage === page ? "active" : ""
                }`}
                onClick={() => navigateToPage(page)}
              >
                {page}
              </div>
            )
          )}
        </nav>

        <main className="main-content">
          {activePage === "Organizations" ? (
            <div>
              <h2>Organizations</h2>
              <p>View organizations, their schools, and associated users.</p>

              {organizationLoading && <p>Loading...</p>}

              {organizationError && (
                <p className="error-message">{organizationError}</p>
              )}

              {!organizationLoading &&
                !organizationError &&
                !selectedOrganization && (
                  <div className="organization-list">
                    {organizations.length === 0 ? (
                      <p>No organizations found.</p>
                    ) : (
                      organizations.map((organization) => (
                        <div
                          key={organization.id}
                          className="organization-card"
                          onClick={() =>
                            loadOrganizationDetails(organization.id)
                          }
                        >
                          <div className="organization-card-header">
                            <div className="organization-icon">
                              <span>
                                {organization.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                            </div>

                            <div className="organization-card-title">
                              <h3>{organization.name}</h3>
                              <p>Organization ID: {organization.id}</p>
                            </div>
                          </div>

                          <div className="organization-card-stats">
                            <div className="organization-stat">
                              <span className="organization-stat-label">
                                Schools
                              </span>
                              <strong>
                                {organization.school_count ?? "—"}
                              </strong>
                            </div>

                            <div className="organization-stat">
                              <span className="organization-stat-label">
                                Users
                              </span>
                              <strong>
                                {organization.user_count ?? "—"}
                              </strong>
                            </div>
                          </div>

                          <div className="organization-card-footer">
                            <span>View organization</span>
                            <span aria-hidden="true">→</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              {!organizationLoading &&
                !organizationError &&
                selectedOrganization && (
                <div className="organization-details">
                  <button
                    className="back-to-organizations-button"
                    onClick={() => {
                      setSelectedOrganization(null);
                      loadOrganizations();
                    }}
                  >
                    &larr; Back to Organizations
                  </button>

                    <h3>{selectedOrganization.name}</h3>

                    <h4>Schools</h4>

                    {!selectedOrganization.schools ||
                    selectedOrganization.schools.length === 0 ? (
                      <p>No schools found for this organization.</p>
                    ) : (
                      selectedOrganization.schools.map((school) => (
                        <div className="school-card" key={school.id}>
                          <h4>{school.name}</h4>

                          <h5>Users</h5>

                          {!school.users || school.users.length === 0 ? (
                            <p>No users found for this school.</p>
                          ) : (
                            <div className="school-user-list">
                              {school.users.map((user) => (
                                <div className="school-user-card" key={user.id}>
                                  <div className="school-user-header">
                                    <div className="school-user-avatar">
                                      {user.name
                                        .split(" ")
                                        .filter(Boolean)
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>

                                    <div className="school-user-identity">
                                      <strong>{user.name}</strong>
                                      <span>{user.role}</span>
                                    </div>
                                  </div>

                                  <div className="school-user-email">
                                    <span className="school-user-email-label">Email</span>
                                    <a href={`mailto:${user.email}`}>
                                      {user.email}
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
            </div>
          ) : (
            <>
              <h2>
                {activePage === "Tickets"
                  ? "Tickets"
                  : activePage === "Incidents"
                    ? "Incidents"
                    : activePage === "Users"
                      ? "Users"
                      : "Support Dashboard"}
              </h2>

              {selectedTicket && (
                <div className="ticket-details">
                  <div className="ticket-details-header">
                    <div>
                      {isEditingTicket ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(event.target.value)
                          }
                          className="ticket-edit-title"
                        />
                      ) : (
                        <h3>{selectedTicket.title}</h3>
                      )}

                      <span>Ticket #{selectedTicket.id}</span>
                    </div>

                    <div className="ticket-details-actions">
                      {isEditingTicket ? (
                        <>
                          <button
                            onClick={saveTicketEdits}
                            className="save-ticket-button"
                          >
                            Save Changes
                          </button>

                          <button
                            onClick={() => setIsEditingTicket(false)}
                            className="cancel-ticket-button"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={startEditingTicket}
                          className="edit-ticket-button"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedTicket(null);
                          setIsEditingTicket(false);
                        }}
                        className="close-details-button"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="ticket-details-content">
                    {isEditingTicket ? (
                      <>
                        <textarea
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(event.target.value)
                          }
                          className="ticket-edit-description"
                        />

                        <div className="ticket-details-meta">
                          <label>
                            Priority:
                            <select
                              value={editPriority}
                              onChange={(event) =>
                                setEditPriority(event.target.value)
                              }
                              className="ticket-edit-priority"
                            >
                              <option value="P1">P1</option>
                              <option value="P2">P2</option>
                              <option value="P3">P3</option>
                              <option value="P4">P4</option>
                            </select>
                          </label>

                          <span>Status: {selectedTicket.status}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{selectedTicket.description}</p>

                        <div className="ticket-details-meta">
                          <span>Priority: {selectedTicket.priority}</span>
                          <span>Status: {selectedTicket.status}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <h3>Create Ticket</h3>

              <div className="ticket-form">
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

                <label className="ticket-caller-field">
                  Caller
                  <select
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    disabled={userLoading || users.length === 0}
                  >
                    <option value="">
                      {userLoading ? "Loading callers..." : "Select a caller (optional)"}
                    </option>

                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} — {user.school_name}
                      </option>
                    ))}
                  </select>
                </label>

                {userError && <p className="error-message">{userError}</p>}

                <div className="ticket-form-row">
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
                </div>
              </div>

              <h3>Tickets</h3>

              {tickets.length === 0 ? (
                <p>No tickets found.</p>
              ) : (
                <div className="ticket-list">
                  {tickets.map((ticket) => (
                    <div
                      className="ticket-card"
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="ticket-card-header">
                        <strong>{ticket.title}</strong>

                        <span
                          className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <p>{ticket.description}</p>
                      {ticket.caller_name && (
                        <div className="ticket-caller-details">
                          <span>Caller: {ticket.caller_name}</span>
                          <span>School: {ticket.school_name}</span>
                          <span>Organization: {ticket.organization_name}</span>
                        </div>
                      )}

                      <div className="ticket-card-footer">
                        <span>Ticket #{ticket.id}</span>

                        <select
                          value={ticket.status}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            updateTicketStatus(ticket.id, event.target.value)
                          }
                          className="ticket-status"
                        >
                          <option value="Open">Open</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Layout;