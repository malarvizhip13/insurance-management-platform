import { useState, useEffect } from "react";
import { supabase } from "../services/config";

function Claims() {
  const [policies, setPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [reason, setReason] = useState("");
  const [claims, setClaims] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
  fetchPolicies();
  fetchClaims();
}, []);

  const fetchPolicies = async () => {
    const { data, error } = await supabase
      .from("policies")
      .select("id, policy_number");

    if (!error) {
      setPolicies(data);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!policyId) {
    alert("Please select a policy");
    return;
  }

  if (isEditing) {
    const { error } = await supabase
      .from("claims")
      .update({
        policy_id: policyId,
        claim_amount: claimAmount,
        reason: reason,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Claim Updated Successfully!");
  } else {
    const { error } = await supabase
      .from("claims")
      .insert([
        {
          policy_id: policyId,
          claim_amount: claimAmount,
          reason: reason,
          status: "Pending",
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Claim Added Successfully!");
  }

  fetchClaims();

  setPolicyId("");
  setClaimAmount("");
  setReason("");
  setEditId(null);
  setIsEditing(false);
};
const handleEdit = (claim) => {
  setEditId(claim.id);
  setPolicyId(claim.policy_id);
  setClaimAmount(claim.claim_amount);
  setReason(claim.reason);
  setIsEditing(true);
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this claim?")) return;

  const { error } = await supabase
    .from("claims")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Claim Deleted Successfully!");
  fetchClaims();
};
const fetchClaims = async () => {
  const { data, error } = await supabase
    .from("claims")
    .select(`
      *,
      policies(policy_number)
    `)
    .order("created_at", { ascending: false });

  if (!error) {
    setClaims(data);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Claim Management</h1>

<input
  type="text"
  placeholder="Search Policy Number..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<br /><br />
      <form onSubmit={handleSubmit}>
        <select
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
        >
          <option value="">Select Policy</option>

          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.policy_number}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Claim Amount"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <br /><br />

       <button type="submit">
  {isEditing ? "Update Claim" : "Save Claim"}
</button>
      </form>
      <hr />

<h2>Claim List</h2>

<table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>Policy No</th>
      <th>Claim Amount</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Submission Date</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {claims
  .filter((claim) =>
    claim.policies?.policy_number
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((claim) => (
    <tr key={claim.id}>
      <td>{claim.policies?.policy_number}</td>
      <td>{claim.claim_amount}</td>
      <td>{claim.reason}</td>
      <td>{claim.status}</td>
      <td>{claim.submission_date}</td>

      <td>
  <button
  type="button"
  onClick={async () => {
    const { error } = await supabase
      .from("claims")
      .update({ status: "Approved" })
      .eq("id", claim.id);

    if (error) {
      alert(error.message);
    } else {
      fetchClaims();
    }
  }}
>
  Approve
</button>
<button
  type="button"
  onClick={async () => {
    const { error } = await supabase
      .from("claims")
      .update({ status: "Rejected" })
      .eq("id", claim.id);

    if (error) {
      alert(error.message);
    } else {
      fetchClaims();
    }
  }}
>
  Reject
</button>

  <button
    type="button"
    onClick={() => handleEdit(claim)}
    style={{ marginLeft: "10px" }}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(claim.id)}
    style={{ marginLeft: "10px" }}
  >
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

export default Claims;