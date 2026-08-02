import { useState, useEffect } from "react";
import { supabase } from "../services/config";
function Customers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isEditing) {
    const { error } = await supabase
      .from("customers")
      .update({
        name,
        email,
        phone,
        dob,
        address,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
    } else {
      alert("Customer Updated Successfully!");
    }
  } else {
    const { error } = await supabase.from("customers").insert([
      {
        name,
        email,
        phone,
        dob,
        address,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Customer Added Successfully!");
    }
  }

  fetchCustomers();

  setName("");
  setEmail("");
  setPhone("");
  setDob("");
  setAddress("");
  setEditId(null);
  setIsEditing(false);
};
const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) {
    setCustomers(data);
  }
};
useEffect(() => {
  fetchCustomers();
}, []);

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
  } else {
    alert("Customer Deleted Successfully!");
    fetchCustomers();
  }
};

const handleEdit = (customer) => {
  setEditId(customer.id);
  setName(customer.name);
  setEmail(customer.email);
  setPhone(customer.phone);
  setDob(customer.dob);
  setAddress(customer.address);
  setIsEditing(true);
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Management</h1>
<input
  type="text"
  placeholder="Search by Name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<br /><br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br /><br />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br /><br />

        <button type="submit">
  {isEditing ? "Update Customer" : "Save Customer"}
</button>
      </form>
      <hr />

<h2>Customer List</h2>

<table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>DOB</th>
      <th>Address</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {customers
  .filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((customer) => (
      <tr key={customer.id}>
        <td>{customer.name}</td>
        <td>{customer.email}</td>
        <td>{customer.phone}</td>
        <td>{customer.dob}</td>
        <td>{customer.address}</td>
        <td>
              <button onClick={() => handleEdit(customer)}>
    Edit
  </button>
  <button onClick={() => handleDelete(customer.id)}>
    Delete
  </button>
</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default Customers;