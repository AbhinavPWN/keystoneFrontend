"use client";

import { Announcement } from "./Types";
import { useEffect, useState } from "react";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./api";
import AnnouncementFormModal from "./AnnouncementFormModal";
import { Button } from "@/components/ui/button";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  async function loadAnnouncements() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch {
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleCreate(data: Partial<Announcement>) {
    try {
      await createAnnouncement(data);
      setModalOpen(false);
      loadAnnouncements();
    } catch {
      setError("Failed to create announcement.");
    }
  }

  async function handleUpdate(data: Partial<Announcement>) {
    if (!editingAnnouncement) return;
    try {
      await updateAnnouncement(editingAnnouncement.documentId, data);
      setModalOpen(false);
      setEditingAnnouncement(null);
      loadAnnouncements();
    } catch {
      setError("Failed to update announcement.");
    }
  }

  async function handleDelete(documentId: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncement(documentId);
      loadAnnouncements();
    } catch {
      setError("Failed to delete announcement.");
    }
  }

  function openAddModal() {
    setEditingAnnouncement(null);
    setModalOpen(true);
  }

  function openEditModal(announcement: Announcement) {
    setEditingAnnouncement(announcement);
    setModalOpen(true);
  }

  if (loading) return <p>Loading announcements...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Announcements</h2>
        <Button onClick={openAddModal}>+ Add</Button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <AnnouncementFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={editingAnnouncement ? handleUpdate : handleCreate}
        initialData={editingAnnouncement ?? undefined}
      />

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="border bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.message}</p>
              <div className="text-sm mt-2">
                <span className="text-blue-600">{a.ctaText}</span>{" "}
                <span className="text-gray-500">({a.ctaLink})</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => openEditModal(a)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(a.documentId)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
