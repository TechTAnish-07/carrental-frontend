import React, { useEffect, useRef, useState } from "react";
import api from "../components/Axios";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Shield,
  Trash2,
  Upload,
  Check,
  X,
  Edit2,
  Camera,
  Mail,
  Award,
  AlertCircle,
} from "lucide-react";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthProvider";

const Profile = () => {
  const { user, fetchUser, isUser } = useAuth();
  const profile = user; 
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const [aadhaar, setAadhaar] = useState(null);
  const [dl, setDl] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef(null);
 

  /* ================= UPDATE DETAILS ================= */
  const saveDetails = async () => {
    try {
      setLoading(true);
      await api.put("/api/user-detail/details", formData);
      setEditing(false);
      await fetchUser();
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE PROFILE IMAGE ================= */
  const handlePhotoUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (!profileImage) return;
    uploadProfileImage();
  }, [profileImage]);

  const uploadProfileImage = async () => {
    if (!profileImage) return;

    if (!profileImage.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (profileImage.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("profileImage", profileImage);

      await api.post("/api/user-detail/profile-image", data);

      setProfileImage(null);
      await fetchUser();
      alert("Profile image uploaded successfully");
    } catch {
      alert("Profile image upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD KYC ================= */
  const uploadKyc = async () => {
    if (!aadhaar || !dl) {
      alert("Upload both Aadhaar & Driving License");
      return;
    }

    const data = new FormData();
    data.append("aadhaar", aadhaar);
    data.append("drivingLicense", dl);

    try {
      setLoading(true);
      await api.post("/api/user-detail/kyc", data);
      setAadhaar(null);
      setDl(null);
      await fetchUser();
      alert("KYC uploaded successfully");
    } catch {
      alert("KYC upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE KYC ================= */
  const removeKyc = async (type) => {
    if (!window.confirm("Remove this document?")) return;

    try {
      if (type === "aadhaar") {
        await api.delete("/api/user-detail/kyc/aadhaar");
      } else {
        await api.delete("/api/user-detail/kyc/driving-license");
      }
      fetchProfile();
    } catch {
      alert("Failed to remove document");
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    try {
      await api.delete("/api/user-detail/delete");
      localStorage.clear();
      window.location.href = "/signin";
    } catch {
      alert("Failed to delete account");
    }
  };

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* ================= HEADER ================= */}
      <div className="profile-header">
        <div className="header-content">
          <div className="profile-pic">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt="Profile" className="profile-img" />
            ) : (
              <User size={56} />
            )}

            <button className="camera-btn" onClick={handlePhotoUpload}>
              <Camera size={18} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>

          <div className="header-info">
            <h1>{profile.name}</h1>
            <div className="header-meta">
              <span>
                <Mail size={16} /> {profile.email}
              </span>
            </div>
            <div className="badge">
              <Award size={18} /> Account Active
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {isUser && (
        <div className="profile-content">
          {/* LEFT COLUMN */}
          <div className="left-column">
            {/* PERSONAL DETAILS */}
            <div className="card">
              <div className="card-header">
                <h2>
                  <User size={20} /> Personal Details
                </h2>
                {!editing && (
                  <button className="btn primary" onClick={() => setEditing(true)}>
                    <Edit2 size={16} /> Edit
                  </button>
                )}
              </div>

              <div className="card-body">
                {editing ? (
                  <>
                    <input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Phone"
                    />
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Address"
                    />
                    <div className="btn-group">
                      <button className="btn success" onClick={saveDetails} disabled={loading}>
                        <Check /> Save
                      </button>
                      <button className="btn secondary" onClick={() => setEditing(false)}>
                        <X /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><Phone /> {profile.phone || "Not provided"}</p>
                    <p><MapPin /> {profile.address || "Not provided"}</p>
                  </>
                )}
              </div>
            </div>

            {/* KYC */}
            <div className="card">
              <div className="card-header">
                <h2><FileText size={20} /> KYC Documents</h2>
              </div>

              <div className="card-body">
                <div className="upload-box">
                  <label>Aadhaar Card</label>
                  <input type="file" onChange={(e) => setAadhaar(e.target.files[0])} />
                </div>

                <div className="upload-box">
                  <label>Driving License</label>
                  <input type="file" onChange={(e) => setDl(e.target.files[0])} />
                </div>

                <button className="btn primary full" onClick={uploadKyc} disabled={loading}>
                  {loading ? "Uploading..." : <><Upload size={18} /> Upload / Update KYC</>}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <div className="card danger">
              <h3><Shield /> Security</h3>

              <button className="btn secondary full" onClick={logout}>Logout</button>

              {!showDeleteConfirm ? (
                <button className="btn danger full" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 /> Delete Account
                </button>
              ) : (
                <>
                  <p className="warning"><AlertCircle /> This cannot be undone</p>
                  <button className="btn danger full" onClick={deleteAccount}>
                    Confirm Delete
                  </button>
                  <button className="btn secondary full" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
