"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface SelectParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Array<{
    _id: Id<any>;
    title: string;
  }>;
  onSelect: (id: Id<any>) => void;
}

export function SelectParentModal({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
}: SelectParentModalProps) {
  const [selectedId, setSelectedId] = useState<string>("");

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId as Id<any>);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder={`Select a ${title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedId}>
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 