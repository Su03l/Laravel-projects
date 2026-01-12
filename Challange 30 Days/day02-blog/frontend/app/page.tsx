"use client";

import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category?: Category;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"post" | "category">("post");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Post form
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategoryId, setPostCategoryId] = useState<number | string>("");

  // Category form
  const [categoryName, setCategoryName] = useState("");

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/posts`),
        fetch(`${API_URL}/categories`),
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setPostTitle("");
    setPostContent("");
    setPostCategoryId("");
    setCategoryName("");
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/posts/${editingId}` : `${API_URL}/posts`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          category_id: Number(postCategoryId),
        }),
      });

      if (res.ok) {
        fetchData();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (res.ok) {
        fetchData();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (type: "post" | "category", id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const endpoint = type === "post" ? "posts" : "categories";
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = (type: "post" | "category", item: Post | Category) => {
    setFormType(type);
    setShowForm(true);
    setEditingId(item.id);

    if (type === "post") {
      const post = item as Post;
      setPostTitle(post.title);
      setPostContent(post.content);
      setPostCategoryId(post.category_id);
    } else {
      setCategoryName((item as Category).name);
    }
  };

  const openNewForm = (type: "post" | "category") => {
    resetForm();
    setFormType(type);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Blog</h1>
        <p style={styles.subtitle}>Day 02 Challenge</p>
      </header>

      {/* Tabs */}
      <nav style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "posts" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "categories" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("categories")}
        >
          Categories ({categories.length})
        </button>
      </nav>

      {/* Add Button */}
      <div style={styles.actionBar}>
        <button
          style={styles.addButton}
          onClick={() => openNewForm(activeTab === "posts" ? "post" : "category")}
        >
          + Add {activeTab === "posts" ? "Post" : "Category"}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => resetForm()}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingId ? "Edit" : "New"} {formType === "post" ? "Post" : "Category"}
            </h2>

            {formType === "post" ? (
              <form onSubmit={handleSubmitPost}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={postCategoryId}
                    onChange={(e) => setPostCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Content</label>
                  <textarea
                    style={styles.textarea}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={6}
                    required
                  />
                </div>
                <div style={styles.buttonGroup}>
                  <button type="button" style={styles.cancelButton} onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitButton}>
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitCategory}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div style={styles.buttonGroup}>
                  <button type="button" style={styles.cancelButton} onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitButton}>
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main style={styles.main}>
        {activeTab === "posts" ? (
          posts.length === 0 ? (
            <div style={styles.empty}>
              <p>No posts yet.</p>
              <button style={styles.emptyButton} onClick={() => openNewForm("post")}>
                Create your first post
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {posts.map((post) => (
                <article key={post.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    {post.category && (
                      <span style={styles.badge}>{post.category.name}</span>
                    )}
                    <span style={styles.date}>
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <h3 style={styles.cardTitle}>{post.title}</h3>
                  <p style={styles.cardContent}>
                    {post.content.length > 150
                      ? post.content.substring(0, 150) + "..."
                      : post.content}
                  </p>
                  <div style={styles.cardActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit("post", post)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete("post", post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : categories.length === 0 ? (
          <div style={styles.empty}>
            <p>No categories yet.</p>
            <button style={styles.emptyButton} onClick={() => openNewForm("category")}>
              Create your first category
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {categories.map((category) => (
              <div key={category.id} style={styles.listItem}>
                <span style={styles.listItemName}>{category.name}</span>
                <div style={styles.listItemActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit("category", category)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete("category", category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--foreground)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  logo: {
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "-2px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "var(--muted-text)",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "32px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  tab: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--muted-text)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "8px",
  },
  tabActive: {
    color: "var(--foreground)",
    background: "var(--muted)",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "24px",
  },
  addButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--background)",
    background: "var(--foreground)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "var(--background)",
    padding: "32px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "500px",
    border: "1px solid var(--border)",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
    color: "var(--muted-text)",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--background)",
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--background)",
    color: "var(--foreground)",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--background)",
    color: "var(--foreground)",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  cancelButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--foreground)",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--background)",
    background: "var(--foreground)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    marginTop: "24px",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--muted-text)",
  },
  emptyButton: {
    marginTop: "16px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--foreground)",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "24px",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    transition: "box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  badge: {
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "500",
    background: "var(--muted)",
    borderRadius: "100px",
  },
  date: {
    fontSize: "12px",
    color: "var(--muted-text)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
    lineHeight: "1.4",
  },
  cardContent: {
    fontSize: "14px",
    color: "var(--muted-text)",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    borderTop: "1px solid var(--border)",
    paddingTop: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
  },
  listItemName: {
    fontSize: "16px",
    fontWeight: "500",
  },
  listItemActions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--foreground)",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#dc2626",
    background: "transparent",
    border: "1px solid #dc2626",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
