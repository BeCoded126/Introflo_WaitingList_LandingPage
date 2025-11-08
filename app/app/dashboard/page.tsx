"use client";

import React, { useState, useRef } from "react";
import ConversationsSidebar, {
  Conversation,
} from "@/components/ConversationsSidebar";
import ChatView, { ChatMessage } from "@/components/ChatView";
import FiltersPanel, { FilterOptions } from "@/components/FiltersPanel";
import SwipeDeck from "@/components/SwipeDeck";
import MobileNav from "@/components/MobileNav";
import type { Facility } from "@/components/Card";

// Import styles
import "@/styles/conversations.css";
import "@/styles/chat.css";
import "@/styles/filters.css";
import "./dashboard.css";

// Mock data
const MOCK_USER = {
  name: "Dr. Sarah Mitchell",
  image: undefined,
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    facilityId: "f1",
    facilityName: "Mindful Recovery Center",
    lastMessage: "Thanks for connecting! We'd love to discuss referrals.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    matchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 2,
  },
  {
    id: "c2",
    facilityId: "f2",
    facilityName: "Serenity Wellness Group",
    lastMessage: "What age groups do you primarily work with?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    matchedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: { [key: string]: ChatMessage[] } = {
  c1: [
    {
      id: "m1",
      senderId: "f1",
      text: "Thanks for connecting! We'd love to discuss potential referrals.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "m2",
      senderId: "current-user",
      text: "Absolutely! What populations do you primarily serve?",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
  ],
  c2: [
    {
      id: "m3",
      senderId: "current-user",
      text: "Hi! Thanks for the match.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "m4",
      senderId: "f2",
      text: "What age groups do you primarily work with?",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ],
};

const MOCK_FACILITIES: Facility[] = [
  {
    id: "f101",
    name: "Miami Wellness Institute",
    city: "Miami",
    state: "FL",
    services: ["Therapy", "Med Management", "IOP"],
    ageGroups: ["Adult (26-64)", "Young Adult (18-25)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
    bio: "Evidence-based care for adults and young adults with a collaborative team approach.",
    insurances: ["Florida Blue", "Aetna", "UnitedHealthcare", "Cigna"],
  },
  {
    id: "f102",
    name: "Coral Gables Counseling Center",
    city: "Coral Gables",
    state: "FL",
    services: ["Therapy", "Counseling", "Coaching"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&h=800&fit=crop",
    bio: "Warm, bilingual clinicians specializing in anxiety, mood, and life transitions.",
    insurances: ["Aetna", "Cigna", "Oscar Health"],
  },
  {
    id: "f103",
    name: "South Beach Recovery",
    city: "Miami Beach",
    state: "FL",
    services: ["IOP", "PHP", "Detox"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=800&fit=crop",
    bio: "Beach-adjacent programming focused on sustainable recovery and relapse prevention.",
    insurances: ["Florida Blue", "Humana", "UnitedHealthcare"],
  },
  {
    id: "f104",
    name: "Hialeah Behavioral Health",
    city: "Hialeah",
    state: "FL",
    services: ["Therapy", "Med Management", "Counseling"],
    ageGroups: ["Children (0-12)", "Adolescent (13-17)", "Adult (26-64)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=800&fit=crop",
    bio: "Culturally competent care for families, adolescents, and adults.",
    insurances: ["Molina Healthcare", "Florida Blue", "Medicare", "Medicaid"],
  },
  {
    id: "f105",
    name: "Doral MindCare Clinic",
    city: "Doral",
    state: "FL",
    services: ["Med Management", "TMS", "Therapy"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=800&fit=crop",
    bio: "Measurement-based psychiatry and neuromodulation for treatment-resistant depression.",
    insurances: ["Aetna", "UnitedHealthcare", "Cigna", "Medicare"],
  },
  {
    id: "f106",
    name: "Kendall Family Therapy",
    city: "Kendall",
    state: "FL",
    services: ["Therapy", "Counseling"],
    ageGroups: ["Children (0-12)", "Adolescent (13-17)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1200&h=800&fit=crop",
    bio: "Short-term, skills-based therapy for kids, teens, and caregivers.",
    insurances: ["Florida Blue", "Oscar Health", "Sunshine Health"],
  },
  {
    id: "f107",
    name: "Homestead Recovery & Wellness",
    city: "Homestead",
    state: "FL",
    services: ["Detox", "PHP", "IOP"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
    bio: "Medically supervised detox with seamless step-down to PHP and IOP.",
    insurances: ["Humana", "Cigna", "Florida Blue", "WellCare"],
  },
  {
    id: "f108",
    name: "Fort Lauderdale Mind & Body",
    city: "Fort Lauderdale",
    state: "FL",
    services: ["Therapy", "IOP", "Med Management"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&h=800&fit=crop",
    bio: "Integrated mental health and primary care coordination for whole-person outcomes.",
    insurances: ["UnitedHealthcare", "Aetna", "Florida Blue", "Medicare"],
  },
  {
    id: "f109",
    name: "Hollywood Behavioral Group",
    city: "Hollywood",
    state: "FL",
    services: ["Therapy", "Counseling", "Coaching"],
    ageGroups: ["Adolescent (13-17)", "Young Adult (18-25)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=800&fit=crop",
    bio: "Trauma-informed clinicians offering EMDR and CBT tracks.",
    insurances: ["Cigna", "Aetna", "Molina Healthcare", "Medicaid"],
  },
  {
    id: "f110",
    name: "Pembroke Pines Wellness",
    city: "Pembroke Pines",
    state: "FL",
    services: ["Therapy", "Med Management", "TMS"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=800&fit=crop",
    bio: "Outcome-driven, tech-enabled care with same-week psychiatric evaluations.",
    insurances: ["Florida Blue", "UnitedHealthcare", "Cigna", "Ambetter"],
  },
  {
    id: "f111",
    name: "Miramar Counseling Collective",
    city: "Miramar",
    state: "FL",
    services: ["Therapy", "Counseling"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop",
    bio: "Affordable counseling with evening and weekend availability.",
    insurances: ["Oscar Health", "Aetna", "Simply Healthcare"],
  },
  {
    id: "f112",
    name: "Aventura Mental Health Center",
    city: "Aventura",
    state: "FL",
    services: ["Med Management", "Therapy", "ECT"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?w=1200&h=800&fit=crop",
    bio: "Collaborative psychiatric care with on-site therapy for continuity.",
    insurances: ["Florida Blue", "Cigna", "Medicare", "UnitedHealthcare"],
  },
  {
    id: "f113",
    name: "Hallandale Beach Therapy",
    city: "Hallandale Beach",
    state: "FL",
    services: ["Therapy", "Counseling"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop",
    bio: "Strengths-based outpatient therapy for adults and couples.",
    insurances: ["Aetna", "Cigna", "BlueCross BlueShield of Florida"],
  },
  {
    id: "f114",
    name: "Boca Raton Wellness Center",
    city: "Boca Raton",
    state: "FL",
    services: ["Therapy", "TMS", "Med Management"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop",
    bio: "Specialists in mood disorders with psychiatry and TMS under one roof.",
    insurances: ["UnitedHealthcare", "Aetna", "Florida Blue", "Medicare"],
  },
  {
    id: "f115",
    name: "Delray Recovery Institute",
    city: "Delray Beach",
    state: "FL",
    services: ["Detox", "PHP", "IOP"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=1200&h=800&fit=crop",
    bio: "Trauma-informed addiction treatment with family programming.",
    insurances: ["Humana", "Cigna", "UnitedHealthcare", "Sunshine Health"],
  },
  {
    id: "f116",
    name: "West Palm Behavioral Health",
    city: "West Palm Beach",
    state: "FL",
    services: ["Therapy", "Med Management", "IOP", "PHP"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
    bio: "Collaborative care for adults and seniors with co-occurring conditions.",
    insurances: ["Medicare", "Florida Blue", "Aetna", "Humana"],
  },
  {
    id: "f117",
    name: "Pompano Beach Counseling",
    city: "Pompano Beach",
    state: "FL",
    services: ["Therapy", "Counseling", "Coaching"],
    ageGroups: ["Adolescent (13-17)", "Young Adult (18-25)", "Adult (26-64)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1200&h=800&fit=crop",
    bio: "Solution-focused therapy with rapid-access intakes.",
    insurances: ["Oscar Health", "Aetna", "Ambetter"],
  },
  {
    id: "f118",
    name: "Deerfield Beach MindCare",
    city: "Deerfield Beach",
    state: "FL",
    services: ["Med Management", "Therapy"],
    ageGroups: ["Adult (26-64)"],
    verified: false,
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=800&fit=crop",
    bio: "Psychiatric consultations with coordinated psychotherapy.",
    insurances: ["Cigna", "UnitedHealthcare", "WellCare"],
  },
  {
    id: "f119",
    name: "Coral Springs Recovery Center",
    city: "Coral Springs",
    state: "FL",
    services: ["IOP", "PHP", "Therapy", "Detox"],
    ageGroups: ["Young Adult (18-25)", "Adult (26-64)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e1b5e2e9?w=1200&h=800&fit=crop",
    bio: "Evidence-based substance use treatment with dual-diagnosis track.",
    insurances: ["Florida Blue", "Humana", "Cigna", "Medicaid"],
  },
  {
    id: "f120",
    name: "Plantation Behavioral Clinic",
    city: "Plantation",
    state: "FL",
    services: ["Therapy", "Med Management", "TMS", "ECT"],
    ageGroups: ["Adult (26-64)", "Senior (65+)"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&h=800&fit=crop",
    bio: "Outcome-focused psychiatry with advanced neuromodulation options.",
    insurances: ["Aetna", "Florida Blue", "UnitedHealthcare", "Medicare"],
  },
];

export default function AppDashboard() {
  const [view, setView] = useState<"cards" | "chat" | "conversations">("cards");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [matchCount, setMatchCount] = useState(0);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<Facility | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const createdConversationsRef = useRef<Set<string>>(new Set());

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setView("chat");
  };

  const handleCloseChat = () => {
    setView("cards");
    setSelectedConversationId(undefined);
  };

  const handleSendMessage = (text: string) => {
    console.log("Send message:", text);
    // In real app, call API to send message
  };

  const handleMatch = (facility: Facility) => {
    console.log("Matched with:", facility);
    setMatchCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setPendingMatch(facility);
        setShowMatchScreen(true);
        
        // Check if conversation already created for this facility
        if (!createdConversationsRef.current.has(facility.id)) {
          createdConversationsRef.current.add(facility.id);
          
          // Create new conversation
          const newConversation: Conversation = {
            id: `c${Date.now()}`,
            facilityId: facility.id,
            facilityName: facility.name,
            facilityImage: facility.image,
            lastMessage: "You matched! Start the conversation.",
            lastMessageTime: new Date(),
            matchedAt: new Date(),
            unreadCount: 0,
          };
          
          // Add to conversations list at the top
          setConversations(prev => [newConversation, ...prev]);
        }
        
        return 0; // reset count
      }
      return next;
    });
    // In real app, create match and add to conversations
  };

  const handleSkip = (facility: Facility) => {
    console.log("Skipped:", facility);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  };

  // Mobile navigation handlers
  const handleShowChat = () => {
    setView("conversations");
  };

  const handleShowCards = () => {
    setView("cards");
    setSelectedConversationId(undefined);
  };

  const handleShowProfile = () => {
    window.location.href = "/app/profile";
  };

  // Apply filters to facilities
  const filteredFacilities = MOCK_FACILITIES.filter((facility) => {
    // Filter by services
    if (filters.services && filters.services.length > 0) {
      const hasService = filters.services.some((service) =>
        facility.services?.includes(service)
      );
      if (!hasService) return false;
    }

    // Filter by insurances
    if (filters.insurances && filters.insurances.length > 0) {
      const hasInsurance = filters.insurances.some((insurance) =>
        facility.insurances?.includes(insurance)
      );
      if (!hasInsurance) return false;
    }

    // Filter by age groups
    if (filters.ageGroups && filters.ageGroups.length > 0) {
      const hasAgeGroup = filters.ageGroups.some((ageGroup) =>
        facility.ageGroups?.includes(ageGroup)
      );
      if (!hasAgeGroup) return false;
    }

    // Filter by location (basic city match for now)
    if (filters.location && filters.location.trim() !== "") {
      const locationLower = filters.location.toLowerCase();
      const cityMatch = facility.city?.toLowerCase().includes(locationLower);
      const stateMatch = facility.state?.toLowerCase().includes(locationLower);
      if (!cityMatch && !stateMatch) return false;
    }

    return true;
  });

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="app-dashboard">
      {/* DEBUG INFO */}
      <pre style={{position:'fixed',top:0,left:0,right:0,background:'#f8f8f8',color:'#c00',padding:8,zIndex:9999,fontSize:12,borderBottom:'2px solid #c00'}}>
        {JSON.stringify({view, matchCount, showMatchScreen, pendingMatch: pendingMatch?.name, selectedConversationId}, null, 2)}
      </pre>

      {/* Match Screen Modal */}
      {showMatchScreen && pendingMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg,#7c3aed,#059669,#d97706)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 40,
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
            You matched with <span style={{ color: '#ffe082' }}>{pendingMatch.name}</span>!
          </h2>
          <p style={{ fontSize: 18, opacity: 0.92, marginBottom: 32, textAlign: 'center' }}>
            A new conversation has been started.
          </p>
          <button
            style={{
              background: 'white',
              color: '#ff655c',
              border: 'none',
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 30,
              padding: '16px 48px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
            }}
            onClick={() => {
              setShowMatchScreen(false);
              setPendingMatch(null);
            }}
          >Continue Swiping</button>
        </div>
      )}

      {/* Left Sidebar - Conversations (Desktop Only) */}
      <ConversationsSidebar
        currentUser={MOCK_USER}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onConversationSelect={handleConversationSelect}
        onProfileClick={() => (window.location.href = "/app/profile")}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Conversations View (Mobile Only) */}
        {view === "conversations" && (
          <div className="mobile-conversations-view">
            <div className="mobile-conversations-header">
              <h2>Matches</h2>
            </div>
            <div className="mobile-conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="mobile-conversation-item"
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="conversation-avatar">
                    {conversation.facilityImage ? (
                      <img
                        src={conversation.facilityImage}
                        alt={conversation.facilityName}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {conversation.facilityName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-top">
                      <h3>{conversation.facilityName}</h3>
                      <span className="time">
                        {new Date(
                          conversation.lastMessageTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="conversation-bottom">
                      <p>{conversation.lastMessage}</p>
                      {(conversation.unreadCount ?? 0) > 0 && (
                        <span className="unread-badge">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards View */}
        {view === "cards" && (
          <>
            {/* Filters Button */}
            <div className="dashboard-header">
              <button
                className="filters-trigger-btn"
                onClick={() => setShowFilters(true)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
                Filters
                {(filters.insurances?.length || 0) +
                  (filters.services?.length || 0) +
                  (filters.ageGroups?.length || 0) >
                  0 && (
                  <span className="filters-count">
                    {(filters.insurances?.length || 0) +
                      (filters.services?.length || 0) +
                      (filters.ageGroups?.length || 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Swipe Deck */}
            <div className="cards-container">
              <SwipeDeck
                facilities={filteredFacilities}
                onMatch={handleMatch}
                onSkip={handleSkip}
              />
            </div>
          </>
        )}

        {/* Chat View */}
        {view === "chat" && selectedConversation && (
          <ChatView
            conversationId={selectedConversation.id}
            facilityName={selectedConversation.facilityName}
            facilityImage={selectedConversation.facilityImage}
            messages={MOCK_MESSAGES[selectedConversation.id] || []}
            currentUserId="current-user"
            onClose={handleCloseChat}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav
        onShowChat={handleShowChat}
        onShowCards={handleShowCards}
        onShowProfile={handleShowProfile}
        currentView={
          view === "conversations" || view === "chat" ? "chat" : view
        }
      />
    </div>
  );
}
