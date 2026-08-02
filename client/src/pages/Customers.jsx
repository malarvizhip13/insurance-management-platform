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
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Customer Management
    </h1>

    {/* Search */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 Search by Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    {/* Form */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded-lg px-4 py-2 md:col-span-2"
          rows="3"
        />

        <button
          type="submit"
          className={`md:col-span-2 text-white py-3 rounded-lg font-semibold transition ${
            isEditing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Update Customer" : "Save Customer"}
        </button>
      </form>
    </div>

    {/* Table */}
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Customer List
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">DOB</th>
            <th className="p-3">Address</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {customers
            .filter((customer) =>
              customer.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.dob}</td>
                <td className="p-3">{customer.address}</td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
export default Customers;