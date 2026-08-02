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
    <div style={{ padding: "20px" }}>
      <h1>Policy Management</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Policy Type"
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Premium Amount"
          value={premiumAmount}
          onChange={(e) => setPremiumAmount(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <br /><br />

        <button type="submit">
  {isEditing ? "Update Policy" : "Save Policy"}
</button>
      </form>
      <hr />

<h2>Policy List</h2>

<table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>Customer</th>
      <th>Policy No</th>
      <th>Policy Type</th>
      <th>Premium</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {policies.map((policy) => (
      <tr key={policy.id}>
        <td>{policy.customers?.name}</td>
        <td>{policy.policy_number}</td>
        <td>{policy.policy_type}</td>
        <td>{policy.premium_amount}</td>
        <td>{policy.start_date}</td>
        <td>{policy.end_date}</td>
        <td>{policy.status}</td>
        <td>
            <button type="button" onClick={() => handleEdit(policy)}>
  Edit
</button>

<button type="button" onClick={() => handleDelete(policy.id)}>
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

export default Policies;