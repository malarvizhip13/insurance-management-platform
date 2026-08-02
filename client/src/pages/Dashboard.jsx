import { useEffect, useState } from "react";
import { supabase } from "../services/config";

function Dashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [policyCount, setPolicyCount] = useState(0);
  const [claimCount, setClaimCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [recentClaims, setRecentClaims] = useState([]);
  useEffect(() => {
  fetchCounts();
  fetchRecentClaims();
}, []);

  const fetchCounts = async () => {
    const { count: customers } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

      const fetchRecentClaims = async () => {
  const { data, error } = await supabase
    .from("claims")
    .select(`
      *,
      policies(policy_number)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!error) {
    setRecentClaims(data);
  }
};

    const { count: policies } = await supabase
      .from("policies")
      .select("*", { count: "exact", head: true });

    const { count: claims } = await supabase
      .from("claims")
      .select("*", { count: "exact", head: true });

    const { count: approved } = await supabase
      .from("claims")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Approved");

    setCustomerCount(customers || 0);
    setPolicyCount(policies || 0);
    setClaimCount(claims || 0);
    setApprovedCount(approved || 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Insurance Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px",
        marginTop: "20px"
      }}>

        <div style={{border:"1px solid gray",padding:"20px"}}>
          <h3>Total Customers</h3>
          <h1>{customerCount}</h1>
        </div>

        <div style={{border:"1px solid gray",padding:"20px"}}>
          <h3>Total Policies</h3>
          <h1>{policyCount}</h1>
        </div>

        <div style={{border:"1px solid gray",padding:"20px"}}>
          <h3>Total Claims</h3>
          <h1>{claimCount}</h1>
        </div>

        <div style={{border:"1px solid gray",padding:"20px"}}>
          <h3>Approved Claims</h3>
          <h1>{approvedCount}</h1>
        </div>

      </div>
      <hr />

<h2>Recent Claims</h2>

<table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>Policy No</th>
      <th>Claim Amount</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {recentClaims.map((claim) => (
      <tr key={claim.id}>
        <td>{claim.policies?.policy_number}</td>
        <td>{claim.claim_amount}</td>
        <td>{claim.status}</td>
        <td>{claim.submission_date}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default Dashboard;