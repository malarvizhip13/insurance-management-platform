import { useEffect, useState } from "react";
import { supabase } from "../services/config";

function PremiumPayments() {
  const [policies, setPolicies] = useState([]);
  const [payments, setPayments] = useState([]);

  const [policyId, setPolicyId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolicies();
    fetchPayments();
  }, []);

  const fetchPolicies = async () => {
    const { data } = await supabase
      .from("policies")
      .select("id, policy_number");

    if (data) setPolicies(data);
  };

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("premium_payments")
      .select(`
        *,
        policies(policy_number)
      `)
      .order("created_at", { ascending: false });

    if (data) setPayments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      const { error } = await supabase
        .from("premium_payments")
        .update({
          policy_id: policyId,
          amount: amount,
          payment_date: paymentDate,
          payment_status: paymentStatus,
        })
        .eq("id", editId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Payment Updated Successfully!");
    } else {
      const { error } = await supabase
        .from("premium_payments")
        .insert([
          {
            policy_id: policyId,
            amount: amount,
            payment_date: paymentDate,
            payment_status: paymentStatus,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Payment Added Successfully!");
    }

    setPolicyId("");
    setAmount("");
    setPaymentDate("");
    setPaymentStatus("Paid");
    setEditId(null);
    setIsEditing(false);

    fetchPayments();
  };

  const handleEdit = (payment) => {
    setEditId(payment.id);
    setPolicyId(payment.policy_id);
    setAmount(payment.amount);
    setPaymentDate(payment.payment_date);
    setPaymentStatus(payment.payment_status);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    const { error } = await supabase
      .from("premium_payments")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Payment Deleted Successfully!");
    fetchPayments();
  };

  return (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Premium Payments
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
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          type="submit"
          className={`md:col-span-2 py-3 rounded-lg text-white font-semibold transition ${
            isEditing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Update Payment" : "Save Payment"}
        </button>
      </form>
    </div>

    {/* Payment Table */}
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Payment List
      </h2>

      <table className="min-w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-3">Policy</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Payment Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {payments
            .filter((payment) =>
              payment.policies?.policy_number
                ?.toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((payment) => (
              <tr
                key={payment.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-4 py-3">
                  {payment.policies?.policy_number}
                </td>

                <td className="px-4 py-3 font-semibold">
                  ₹ {payment.amount}
                </td>

                <td className="px-4 py-3">
                  {payment.payment_date}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      payment.payment_status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.payment_status}
                  </span>
                </td>

                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(payment)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(payment.id)}
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

export default PremiumPayments;