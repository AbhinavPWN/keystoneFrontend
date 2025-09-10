// keystone-admin/announcement/api.ts
"use server";

import { cookies } from "next/headers";
import { Announcement } from "./Types";

const API_URL = `${process.env.STRAPI_API}/announcements`;

async function getToken(): Promise<string> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("keystone_token")?.value;
  if (!token) throw new Error("Unauthorized: JWT not found in cookies");
  return token;
}

function stripSystemFields<T extends object>(
  data: T,
  additionalFieldsToRemove: string [] = []
): Partial<T> {
  const systemFields = [
    "id",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "__v",
    "slug",
    "user",
  ];
  const allToRemove = new Set([...systemFields, ...additionalFieldsToRemove]);

  return Object.keys(data).reduce((cleaned, key) => {
    if (!allToRemove.has(key)) {
      cleaned[key as keyof T] = data[key as keyof T];
    }
    return cleaned;
  }, {} as Partial<T>);
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const token = await getToken();
  const res = await fetch(API_URL, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("❌ Failed to fetch announcements", await res.text());
    throw new Error("Error fetching announcements");
  }

  const json = await res.json();
  return json.data;
}

export async function createAnnouncement(data: Partial<Announcement>) {
  const token = await getToken();
  const cleaned = stripSystemFields(data);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: cleaned }),
  });

  if (!res.ok) {
    console.error("❌ Failed to create announcement", await res.text());
    throw new Error("Failed to create announcement");
  }

  return res.json();
}

// 🔁 Get internal ID by documentId
async function getInternalIdByDocumentId(documentId: string): Promise<number> {
  const token = await getToken();

  const url = `${API_URL}?filters[documentId][$eq]=${documentId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Failed to lookup internal ID", await res.text());
    throw new Error("Error finding internal ID");
  }

  const json = await res.json();
  const entry = json?.data?.[0];
  if (!entry || !entry.id) {
    throw new Error("No entry found for provided documentId");
  }

  return entry.id;
}

// ✅ Update using internal ID from documentId
export async function updateAnnouncement(documentId: string, data: Partial<Announcement>) {
  const id = await getInternalIdByDocumentId(documentId);
  const token = await getToken();
  const cleaned = stripSystemFields(data);

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: cleaned }),
  });

  if (!res.ok) {
    console.error(`❌ Update failed for documentId ${documentId}`, await res.text());
    throw new Error("Failed to update announcement");
  }

  return res.json();
}

// ✅ Delete using internal ID from documentId
export async function deleteAnnouncement(documentId: string) {
  const id = await getInternalIdByDocumentId(documentId);
  const token = await getToken();

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ Delete failed for documentId ${documentId}`, await res.text());
    throw new Error("Failed to delete announcement");
  }

  return res.json();
}
