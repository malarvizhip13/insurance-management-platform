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
    <div style={{ padding: "20px" }}>
      <h1>Premium Payments</h1>

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
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />

        <br /><br />

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option>Paid</option>
          <option>Pending</option>
        </select>

        <br /><br />

        <button type="submit">
          {isEditing ? "Update Payment" : "Save Payment"}
        </button>

      </form>

      <hr />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Policy</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
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

              <tr key={payment.id}>

                <td>{payment.policies?.policy_number}</td>
                <td>{payment.amount}</td>
                <td>{payment.payment_date}</td>
                <td>{payment.payment_status}</td>

                <td>

                  <button
                    onClick={() => handleEdit(payment)}
                    type="button"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(payment.id)}
                    type="button"
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

export default PremiumPayments;