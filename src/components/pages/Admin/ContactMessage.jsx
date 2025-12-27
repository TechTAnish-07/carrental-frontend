import { useEffect, useState } from "react";
import api from "/Users/tanish/web-dev/react/carrental-project/src/components/Axios.jsx";
import AdminLayout from "/Users/tanish/web-dev/react/carrental-project/src/components/AdminLayout.jsx";
import "./ContactMessage.css";
const ContactMessages = () => {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    api.get("/api/contact").then(r => setMsgs(r.data));
  }, []);

  return (
   <AdminLayout>
  <h1 className="admin-title">Messages</h1>

  {msgs.map((m) => (
    <div key={m.id} className="message-card">
      <div className="message-email">{m.email}</div>
      <p className="message-text">{m.message}</p>
    </div>
  ))}
</AdminLayout>

  );
};

export default ContactMessages;
