"use client";

import { config } from "@/lib/config";
import { IconEye, IconEyeOff, IconMail, IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  total: number;
  unread: number;
  read: number;
  recent: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const MessagesPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState<boolean | null>(null);
  const [limit] = useState(10);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterRead !== null) params.append("isRead", filterRead.toString());

      const response = await fetch(`${config.apiBaseUrl}/contact?${params}`);

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setPagination(data.pagination);
      } else {
        setError("Failed to fetch messages");
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterRead, limit]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/contact/stats/summary`,
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Mark as read/unread
  const toggleReadStatus = async (
    contactId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/contact/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isRead: !currentStatus }),
        },
      );

      if (response.ok) {
        fetchContacts();
        fetchStats();
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, isRead: !currentStatus });
        }
      } else {
        setError("Failed to update message status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update message status");
    }
  };

  // Delete contact
  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/contact/${contactId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        fetchContacts();
        fetchStats();
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(null);
        }
      } else {
        setError("Failed to delete message");
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete message");
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-fg text-3xl font-bold">Messages</h1>
        <p className="text-text-secondary">
          Manage contact messages and inquiries
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="bg-card border-border rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <IconMail className="text-primary" size={24} />
              <div>
                <p className="text-text-secondary text-sm">Total Messages</p>
                <p className="text-fg text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-border rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <IconEyeOff className="text-orange-500" size={24} />
              <div>
                <p className="text-text-secondary text-sm">Unread</p>
                <p className="text-fg text-2xl font-bold">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-border rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <IconEye className="text-green-500" size={24} />
              <div>
                <p className="text-text-secondary text-sm">Read</p>
                <p className="text-fg text-2xl font-bold">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-border rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <IconMail className="text-blue-500" size={24} />
              <div>
                <p className="text-text-secondary text-sm">Recent</p>
                <p className="text-fg text-2xl font-bold">{stats.recent}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Messages List */}
        <div className="bg-card border-border flex-1 rounded-lg border">
          {/* Filters */}
          <div className="border-border border-b p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <IconSearch
                  className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border py-2 pr-3 pl-10 focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterRead(null)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    filterRead === null
                      ? "bg-primary text-bg"
                      : "bg-secondary/40 text-fg hover:bg-secondary/60"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterRead(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    filterRead === false
                      ? "bg-primary text-bg"
                      : "bg-secondary/40 text-fg hover:bg-secondary/60"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilterRead(true)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    filterRead === true
                      ? "bg-primary text-bg"
                      : "bg-secondary/40 text-fg hover:bg-secondary/60"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-text-muted">Loading messages...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-muted">No messages found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-secondary/20">
                  <tr>
                    <th className="text-fg px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-fg px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="text-fg px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="text-fg px-6 py-4 text-left text-sm font-semibold">
                      Message Preview
                    </th>
                    <th className="text-fg px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-fg px-6 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className={`hover:bg-secondary/10 transition-colors ${
                        !contact.isRead ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!contact.isRead ? (
                            <div className="flex items-center gap-2">
                              <div className="bg-primary h-2 w-2 rounded-full"></div>
                              <span className="bg-primary text-bg rounded-full px-2 py-1 text-xs font-medium">
                                New
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-text-muted text-xs">
                                Read
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`text-fg font-medium ${!contact.isRead ? "font-semibold" : ""}`}
                        >
                          {contact.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-text-secondary text-sm">
                          {contact.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-text-muted line-clamp-2 max-w-xs text-sm">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-text-muted text-sm">
                          <p>
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs">
                            {new Date(contact.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
                            title="View details"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              toggleReadStatus(contact._id, contact.isRead)
                            }
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                              contact.isRead
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            title={
                              contact.isRead ? "Mark as unread" : "Mark as read"
                            }
                          >
                            {contact.isRead ? "Unread" : "Read"}
                          </button>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                            title="Delete message"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-border border-t p-4">
              <div className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalContacts} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="bg-secondary/40 text-fg hover:bg-secondary/60 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="bg-secondary/40 text-fg hover:bg-secondary/60 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Detail Panel */}
        {selectedContact && (
          <div className="bg-card border-border w-96 rounded-lg border">
            <div className="border-border border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-fg text-lg font-semibold">
                  Message Details
                </h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-text-muted hover:text-fg text-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto p-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                {!selectedContact.isRead ? (
                  <span className="bg-primary text-bg inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    New Message
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Read
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-secondary/10 rounded-lg p-4">
                <h3 className="text-fg mb-3 text-sm font-semibold tracking-wide uppercase">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                      Full Name
                    </label>
                    <p className="text-fg mt-1 text-lg font-medium">
                      {selectedContact.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                      Email Address
                    </label>
                    <p className="text-text-secondary mt-1">
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedContact.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-secondary/10 rounded-lg p-4">
                <h3 className="text-fg mb-3 text-sm font-semibold tracking-wide uppercase">
                  Message Content
                </h3>
                <div className="bg-card border-border rounded-md border p-4">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-secondary/10 rounded-lg p-4">
                <h3 className="text-fg mb-3 text-sm font-semibold tracking-wide uppercase">
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                      Received On
                    </label>
                    <p className="text-text-secondary mt-1">
                      {new Date(selectedContact.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-text-muted text-sm">
                      at{" "}
                      {new Date(selectedContact.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  {selectedContact.updatedAt !== selectedContact.createdAt && (
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                        Last Updated
                      </label>
                      <p className="text-text-secondary mt-1">
                        {new Date(selectedContact.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-text-muted text-sm">
                        at{" "}
                        {new Date(selectedContact.updatedAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() =>
                    toggleReadStatus(
                      selectedContact._id,
                      selectedContact.isRead,
                    )
                  }
                  className={`w-full rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    selectedContact.isRead
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {selectedContact.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedContact.email}?subject=Re: Your Message&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for your message:%0D%0A%0D%0A"${selectedContact.message}"%0D%0A%0D%0ABest regards,`;
                  }}
                  className="bg-primary hover:bg-primary-dark text-bg w-full rounded-md px-4 py-3 text-sm font-medium transition-colors"
                >
                  Reply via Email
                </button>
                <button
                  onClick={() => deleteContact(selectedContact._id)}
                  className="w-full rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
