import { useEffect, useState } from "react";
import { supabase } from "../services/config";

function Employees() {
  const [employees, setEmployees] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setEmployees(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      const { error } = await supabase
        .from("employees")
        .update({
          name,
          email,
          phone,
          designation,
        })
        .eq("id", editId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Employee Updated Successfully!");
    } else {
      const { error } = await supabase
        .from("employees")
        .insert([
          {
            name,
            email,
            phone,
            designation,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Employee Added Successfully!");
    }

    setName("");
    setEmail("");
    setPhone("");
    setDesignation("");

    setEditId(null);
    setIsEditing(false);

    fetchEmployees();
  };

  const handleEdit = (employee) => {
    setEditId(employee.id);
    setName(employee.name);
    setEmail(employee.email);
    setPhone(employee.phone);
    setDesignation(employee.designation);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Employee Deleted Successfully!");
    fetchEmployees();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management</h1>

      <input
        type="text"
        placeholder="Search Employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          {isEditing ? "Update Employee" : "Save Employee"}
        </button>

      </form>

      <hr />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {employees
            .filter((emp) =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (

              <tr key={emp.id}>

                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.designation}</td>

                <td>

                  <button
                    type="button"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(emp.id)}
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

export default Employees;