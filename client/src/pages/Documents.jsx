import { useEffect, useState } from "react";
import { supabase } from "../services/config";

function Documents() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id,name");

    if (data) {
      setCustomers(data);
    }
  };
  const handleUpload = async (e) => {
  e.preventDefault();

  if (!customerId) {
    alert("Please select a customer");
    return;
  }

  if (!file) {
    alert("Please select a file");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(fileName, file);

    const {
  data: { user },
} = await supabase.auth.getUser();

console.log(user);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("documents")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("documents")
    .insert([
      {
        customer_id: customerId,
        file_name: file.name,
        file_url: data.publicUrl,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Document Uploaded Successfully!");

  setCustomerId("");
  setFile(null);
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Document Management</h1>

      <form onSubmit={handleUpload}>
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

        <br />
        <br />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button type="submit">
          Upload Document
        </button>
      </form>
    </div>
  );
}

export default Documents;