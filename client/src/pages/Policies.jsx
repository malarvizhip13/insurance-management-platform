import { useState, useEffect } from "react";
import { supabase } from "../services/config";

function Policies() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [premiumAmount, setPremiumAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [policies, setPolicies] = useState([]);
  const [editId, setEditId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [search, setSearch] = useState("");
  useEffect(() => {
  fetchCustomers();
  fetchPolicies();
}, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id, name");

    if (data) {
      setCustomers(data);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!customerId) {
    alert("Please select a customer");
    return;
  }

  if (isEditing) {
    const { error } = await supabase
      .from("policies")
      .update({
        customer_id: customerId,
        policy_number: policyNumber,
        policy_type: policyType,
        premium_amount: premiumAmount,
        start_date: startDate,
        end_date: endDate,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Policy Updated Successfully!");
  } else {
    const { error } = await supabase.from("policies").insert([
      {
        customer_id: customerId,
        policy_number: policyNumber,
        policy_type: policyType,
        premium_amount: premiumAmount,
        start_date: startDate,
        end_date: endDate,
        status: "Active",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Policy Added Successfully!");
  }

  fetchPolicies();

  setCustomerId("");
  setPolicyNumber("");
  setPolicyType("");
  setPremiumAmount("");
  setStartDate("");
  setEndDate("");
  setEditId(null);
  setIsEditing(false);
};

const fetchPolicies = async () => {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      customers(name)
    `)
    .order("created_at", { ascending: false });

  if (!error) {
    setPolicies(data);
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this policy?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("policies")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
  } else {
    alert("Policy Deleted Successfully!");
    fetchPolicies();
  }
};
const handleEdit = (policy) => {
  setEditId(policy.id);
  setCustomerId(policy.customer_id);
  setPolicyNumber(policy.policy_number);
  setPolicyType(policy.policy_type);
  setPremiumAmount(policy.premium_amount);
  setStartDate(policy.start_date);
  setEndDate(policy.end_date);
  setIsEditing(true);
};

 return (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Policy Management
    </h1>

    {/* Form */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="text"
          placeholder="Policy Type"
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="number"
          placeholder="Premium Amount"
          value={premiumAmount}
          onChange={(e) => setPremiumAmount(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className={`md:col-span-2 py-3 rounded-lg text-white font-semibold transition ${
            isEditing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Update Policy" : "Save Policy"}
        </button>
      </form>
    </div>

    {/* Policy Table */}
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Policy List
      </h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Policy No</th>
            <th className="px-4 py-3">Policy Type</th>
            <th className="px-4 py-3">Premium</th>
            <th className="px-4 py-3">Start Date</th>
            <th className="px-4 py-3">End Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="border-b hover:bg-gray-100 transition"
            >
              <td className="px-4 py-3">{policy.customers?.name}</td>
              <td className="px-4 py-3">{policy.policy_number}</td>
              <td className="px-4 py-3">{policy.policy_type}</td>
              <td className="px-4 py-3">₹ {policy.premium_amount}</td>
              <td className="px-4 py-3">{policy.start_date}</td>
              <td className="px-4 py-3">{policy.end_date}</td>

              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    policy.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {policy.status}
                </span>
              </td>

              <td className="px-4 py-3 space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(policy)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(policy.id)}
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

export default Policies;