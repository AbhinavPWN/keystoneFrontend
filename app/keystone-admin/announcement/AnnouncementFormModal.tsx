"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Announcement } from "./Types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Announcement>) => void;
  initialData?: Partial<Announcement>;
};

export default function AnnouncementFormModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Partial<Announcement>>(initialData || {});

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({});
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? (target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Add"} Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={form.message || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="ctaText">CTA Text</Label>
            <Input
              id="ctaText"
              name="ctaText"
              value={form.ctaText || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="ctaLink">CTA Link</Label>
            <Input
              id="ctaLink"
              name="ctaLink"
              value={form.ctaLink || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active || false}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
