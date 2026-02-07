import React, { useState, useEffect } from "react";

const API = "https://slttranportdatabse.onrender.com/api/blogs";

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    fullContent: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    }
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !file) {
      return alert("Please upload a blog cover image");
    }

    setLoading(true);
    const data = new FormData();

    data.append("title", formData.title);
    data.append("slug", formData.slug.toLowerCase().replace(/\s+/g, "-"));
    data.append("description", formData.description);
    data.append("fullContent", formData.fullContent);
    if (file) data.append("image", file);

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : `${API}/create`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save blog");

      alert(editingId ? "Blog updated successfully!" : "Blog published!");

      resetForm();
      fetchBlogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      fullContent: blog.fullContent || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      fullContent: "",
    });
    setFile(null);
  };

  /* ================= ACTIONS ================= */
  const toggleVisibility = async (id) => {
await fetch(`${API}/${id}/toggle`, { method: "PATCH" });
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  return (
    <div className="page-container">
      <style>{`
        .btn-add { background:#f7b731;color:#002147;border:none;padding:12px 24px;
          border-radius:6px;font-weight:700;cursor:pointer }
        .btn-add:disabled { background:#ccc }
        table { width:100%; border-collapse:collapse; margin-top:20px }
        th,td { border:1px solid #ddd; padding:12px }
        th { background:#f7f7f7 }
        .btn-action { padding:6px 12px;border:none;border-radius:4px;cursor:pointer }
        .btn-toggle { background:#34c759;color:white }
        .btn-edit { background:#0a84ff;color:white }
        .btn-delete { background:#ff3b30;color:white }
        .status-badge { padding:4px 8px;border-radius:4px;color:white }
        .active-bg { background:#34c759 }
        .inactive-bg { background:#ff9500 }
      `}</style>

      <h2>Blog Management</h2>

      {/* ================= FORM ================= */}
      <div style={{ background:"#fff", padding:30, borderRadius:12, marginBottom:40 }}>
        <h3>{editingId ? "Edit Blog Post" : "Write New Post"}</h3>

        <form onSubmit={handleSubmit} style={{ display:"grid", gap:15 }}>
          <input
            placeholder="Blog Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <input
            placeholder="URL Slug"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />

          <textarea
            placeholder="Short Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <textarea
            placeholder="Full Blog Content"
            required
            value={formData.fullContent}
            onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
            style={{ minHeight: 200 }}
          />

          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-add" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <img src={blog.image_url} alt="" style={{ width:100 }} />
              </td>
              <td>{blog.title}</td>
              <td>{blog.description?.slice(0, 80)}...</td>
              <td>
                <span className={`status-badge ${blog.is_active ? "active-bg" : "inactive-bg"}`}>
                  {blog.is_active ? "Public" : "Draft"}
                </span>
              </td>
              <td style={{ display:"flex", gap:6 }}>
                <button className="btn-action btn-edit" onClick={() => handleEdit(blog)}>
                  Edit
                </button>
                <button className="btn-action btn-toggle" onClick={() => toggleVisibility(blog.id)}>
                  {blog.is_active ? "Hide" : "Show"}
                </button>
                <button className="btn-action btn-delete" onClick={() => deleteBlog(blog.id)}>
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
