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
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Document Management
    </h1>

    {/* Upload Form */}
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
      <form
        onSubmit={handleUpload}
        className="flex flex-col gap-5"
      >
        {/* Customer Select */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Customer
          </label>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Document
          </label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer hover:file:bg-blue-700"
          />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          📤 Upload Document
        </button>
      </form>
    </div>
  </div>
);
}

export default Documents;