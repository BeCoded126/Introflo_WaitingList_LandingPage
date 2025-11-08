"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import "./profile.css";

const FL_INSURANCES = [
  "Aetna",
  "BlueCross BlueShield of Florida",
  "Cigna",
  "Florida Blue",
  "Humana",
  "Medicare",
  "Medicaid",
  "UnitedHealthcare",
  "Sunshine Health",
  "Molina Healthcare",
  "WellCare",
  "Simply Healthcare",
  "Oscar Health",
  "Ambetter",
];

const SERVICES = [
  "Therapy",
  "IOP",
  "PHP",
  "Detox",
  "Med Management",
  "TMS",
  "ECT",
  "Counseling",
  "Coaching",
];

export default function ProfilePage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&h=800&fit=crop",
  ]);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([
    "Florida Blue",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
    "Medicare",
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Therapy",
    "IOP",
    "Med Management",
    "Counseling",
  ]);
  const [bio, setBio] = useState(
    "We specialize in evidence-based care for adults and young adults. Our collaborative team approach integrates therapy, medication management, and intensive outpatient programs to support lasting recovery and wellness."
  );
  const [loading, setLoading] = useState(false);

  // Note: Using preset demo data for presentation
  // In production, this would load from API

  const handleShowChat = () => {
    router.push("/app/dashboard");
    // Note: Would need to pass a state to show conversations view
  };

  const handleShowCards = () => {
    router.push("/app/dashboard");
  };

  // Auto-save function with debounce
  const saveProfile = async (updates: {
    images?: string[];
    insurances?: string[];
    services?: string[];
    bio?: string;
  }) => {
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length < 3) {
      const newImage = URL.createObjectURL(files[0]);
      const updated = [...images, newImage];
      setImages(updated);
      saveProfile({ images: updated, insurances: selectedInsurances, services: selectedServices, bio });
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    saveProfile({ images: updated, insurances: selectedInsurances, services: selectedServices, bio });
  };

  const toggleInsurance = (insurance: string) => {
    const updated = selectedInsurances.includes(insurance)
      ? selectedInsurances.filter((i) => i !== insurance)
      : [...selectedInsurances, insurance];
    setSelectedInsurances(updated);
    saveProfile({ images, insurances: updated, services: selectedServices, bio });
  };

  const toggleService = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    saveProfile({ images, insurances: selectedInsurances, services: updated, bio });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setBio(value);
      // Debounce auto-save for bio (save after user stops typing)
      setTimeout(() => {
        saveProfile({ images, insurances: selectedInsurances, services: selectedServices, bio: value });
      }, 1000);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Edit Profile</h1>
        <p className="subtitle">Complete your profile to attract the right referrals</p>
      </div>

      {/* Images Section */}
      <section className="profile-section">
        <div className="section-header">
          <h2>Photos</h2>
          <span className="count">{images.length}/3</span>
        </div>
        <p className="section-description">Add up to 3 photos of your facility</p>
        
        <div className="image-grid">
          {images.map((img, index) => (
            <div key={index} className="image-slot filled">
              <img src={img} alt={`Upload ${index + 1}`} />
              <button
                className="remove-btn"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className="image-slot empty">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <div className="upload-placeholder">
                <span className="plus-icon">+</span>
                <span>Add Photo</span>
              </div>
            </label>
          )}
        </div>
      </section>

      {/* Insurances Section */}
      <section className="profile-section">
        <div className="section-header">
          <h2>Insurances Accepted</h2>
          <span className="count">{selectedInsurances.length}</span>
        </div>
        <p className="section-description">Select all insurances you accept</p>
        
        <div className="options-grid">
          {FL_INSURANCES.map((insurance) => (
            <button
              key={insurance}
              className={`option-pill ${selectedInsurances.includes(insurance) ? "selected" : ""}`}
              onClick={() => toggleInsurance(insurance)}
            >
              {insurance}
            </button>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="profile-section">
        <div className="section-header">
          <h2>Services Provided</h2>
          <span className="count">{selectedServices.length}</span>
        </div>
        <p className="section-description">Select all services you offer</p>
        
        <div className="options-grid">
          {SERVICES.map((service) => (
            <button
              key={service}
              className={`option-pill ${selectedServices.includes(service) ? "selected" : ""}`}
              onClick={() => toggleService(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </section>

      {/* Bio Section */}
      <section className="profile-section">
        <div className="section-header">
          <h2>About Your Facility</h2>
          <span className="count">{bio.length}/300</span>
        </div>
        <p className="section-description">Write a brief description</p>
        
        <textarea
          className="bio-input"
          placeholder="Tell potential referral partners about your facility, approach, and specialties..."
          value={bio}
          onChange={handleBioChange}
          maxLength={300}
          rows={5}
        />
      </section>

      {/* Mobile Navigation */}
      <MobileNav
        onShowChat={handleShowChat}
        onShowCards={handleShowCards}
        currentView="profile"
      />
    </div>
  );
}
