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
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Claim Management
    </h1>

    {/* Search */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 Search Policy Number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    {/* Form */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <select
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="">Select Policy</option>

          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.policy_number}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Claim Amount"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          className="border rounded-lg px-4 py-3 md:col-span-2"
        />

        <button
          type="submit"
          className={`md:col-span-2 py-3 rounded-lg text-white font-semibold transition ${
            isEditing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Update Claim" : "Save Claim"}
        </button>
      </form>
    </div>

    {/* Table */}
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Claim List
      </h2>

      <table className="min-w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-3">Policy No</th>
            <th className="px-4 py-3">Claim Amount</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Submission Date</th>
            <th className="px-4 py-3">Action</th>
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
              <tr
                key={claim.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-4 py-3">
                  {claim.policies?.policy_number}
                </td>

                <td className="px-4 py-3">
                  ₹ {claim.claim_amount}
                </td>

                <td className="px-4 py-3">
                  {claim.reason}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      claim.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : claim.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {claim.submission_date}
                </td>

                <td className="px-4 py-3 flex flex-wrap gap-2">
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
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
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
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(claim)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(claim.id)}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg"
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

export default Claims;