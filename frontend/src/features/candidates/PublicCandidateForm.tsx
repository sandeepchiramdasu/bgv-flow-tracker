import { useState } from "react";
import { publicAPI } from "../../services/axiosInstance";

export default function PublicCandidateForm() {
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    work_email: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone_number.trim())) {
      newErrors.phone_number = "Enter valid 10-digit number";
    }

    if (!form.work_email.trim()) {
      newErrors.work_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.work_email.trim())) {
      newErrors.work_email = "Enter valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setServerError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      await publicAPI.post("/public/candidates/", {
        name: form.name.trim(),
        phone_number: form.phone_number.trim(),
        work_email: form.work_email.trim(),
      });

      setMessage("Verification request submitted successfully");

      setForm({
        name: "",
        phone_number: "",
        work_email: "",
      });

      setErrors({});
    } catch (err: any) {
      const data = err.response?.data;

      if (!data) setServerError("Server not reachable");
      else if (typeof data.error === "string") setServerError(data.error);
      else if (typeof data.error === "object") {
        const key = Object.keys(data.error)[0];
        setServerError(data.error[key][0]);
      } else setServerError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* FORM CARD */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h1 className="text-lg font-semibold text-slate-800">
            Verification Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure background verification
          </p>
        </div>

        {/* ALERTS */}
        {serverError && (
          <div className="mb-3 p-2 bg-red-100 text-red-600 text-xs rounded">
            {serverError}
          </div>
        )}

        {message && (
          <div className="mb-3 p-2 bg-green-100 text-green-600 text-xs rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white 
              transition duration-200
              hover:border-indigo-500
              focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white 
              transition duration-200
              hover:border-indigo-500
              focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone_number}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              name="work_email"
              value={form.work_email}
              onChange={handleChange}
              placeholder="Work Email"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white 
              transition duration-200
              hover:border-indigo-500
              focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            {errors.work_email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.work_email}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2.5 rounded-md font-medium transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-[10px] text-center text-slate-400 mt-4">
          🔒 Secure • Encrypted • Verified
        </p>
      </div>
    </div>
  );
}