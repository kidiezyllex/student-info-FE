"use client";

import { useEffect, useState } from "react";
import { useGetAllEvents, useGetUpcomingEvents, useDeleteEvent } from "@/hooks/useEvent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventTable } from "@/components/EventPage/EventTable";
import { EventCreateDialog } from "@/components/EventPage/EventCreateDialog";
import { EventDetailsDialog } from "@/components/EventPage/EventDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconCalendar, IconFilter, IconX } from "@tabler/icons-react";
import { IEvent } from "@/interface/response/event";
import { DeleteDialog } from "@/components/ui/delete-dialog";

type EventFilter = "all" | "upcoming";

export default function EventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);

  const { data: allEventsData, isLoading: isLoadingAll, refetch: refetchAll } = useGetAllEvents();
  const { data: upcomingEventsData, isLoading: isLoadingUpcoming, refetch: refetchUpcoming } = useGetUpcomingEvents();
  const { mutateAsync: deleteEventMutation, isPending: isDeleting } = useDeleteEvent();

  const isLoading = eventFilter === "all" ? isLoadingAll : isLoadingUpcoming;
  const eventsData = eventFilter === "all" ? allEventsData : upcomingEventsData;
  const refetch = eventFilter === "all" ? refetchAll : refetchUpcoming;

  useEffect(() => {
    if (eventsData?.data) {
      let filtered = eventsData.data;
      
      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.department && event.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  }, [eventsData, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (value: EventFilter) => {
    setEventFilter(value);
  };

  const handleEdit = (id: string) => {
    setSelectedEventId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedEventId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteEventMutation(selectedEventId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSuccess = () => {
    refetchAll();
    refetchUpcoming();
  };

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Event Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full md:w-96">
                <Input
                  placeholder="Search event..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                )}
              </div>
              <Select value={eventFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All events</SelectItem>
                    <SelectItem value="upcoming">Upcoming events</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add event
            </Button>
          </div>

          <Card className="p-0 overflow-hidden border border-lightBorderV1">
            {isLoading ? (
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EventTable
                events={filteredEvents}
                isSearching={!!searchQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        successMessage="Event deleted successfully!"
        errorMessage="Failed to delete event."
        warningMessage="This will permanently remove the event and all associated data."
      />
      
      <EventCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleSuccess}
      />
      
      {selectedEventId && (
        <EventDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedEventId(null);
          }}
          eventId={selectedEventId}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
} 