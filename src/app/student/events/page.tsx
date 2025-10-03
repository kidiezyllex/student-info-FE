"use client";

import { useEffect, useState } from "react";
import { useGetUpcomingEvents, useGetAllEvents } from "@/hooks/useEvent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { IconSearch, IconCalendar, IconMapPin, IconUser, IconFilter, IconExternalLink, IconClock, IconCircleOff, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IEvent } from "@/interface/response/event";
import { Activity } from "lucide-react";

type EventFilter = "upcoming" | "all";

export default function StudentEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<EventFilter>("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);

  const { data: upcomingEventsData, isLoading: isLoadingUpcoming } = useGetUpcomingEvents();
  const { data: allEventsData, isLoading: isLoadingAll } = useGetAllEvents();

  const isLoading = eventFilter === "upcoming" ? isLoadingUpcoming : isLoadingAll;
  const eventsData = eventFilter === "upcoming" ? upcomingEventsData : allEventsData;

  useEffect(() => {
    if (eventsData?.data) {
      let filtered = eventsData.data;
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

  const handleViewDetails = (event: IEvent) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (event: IEvent) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) {
      const daysLeft = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysLeft <= 7) {
        return (
          <Badge variant="orange">
            <IconClock className="h-3 w-3" />
            Starting Soon
          </Badge>
        );
      }
      return (
        <Badge variant="blue">
          <IconCalendar className="h-3 w-3" />
          Upcoming
        </Badge>
      );
    }

    if (now >= startDate && now <= endDate) {
      return <Badge variant="green">
        <Activity className="h-3 w-3" />
        Ongoing
      </Badge>;
    }

    return (
      <Badge variant="slate">
        <IconCalendar className="w-3 h-3" />
        Ended
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Events</BreadcrumbPage>
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
                  placeholder="Search events..."
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

              <div className="flex items-center gap-2">
                <IconFilter className="w-5 h-5 text-mainTextV1" />
                <Select value={eventFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming events</SelectItem>
                    <SelectItem value="all">All events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="border border-lightBorderV1">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 flex flex-col">
                          <CardTitle className="text-lg text-mainTextV1 line-clamp-2">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="text-secondaryTextV1 mt-1">
                            Organized by {event.organizer}
                          </CardDescription>
                          {getStatusBadge(event)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-secondaryTextV1 line-clamp-3 mb-4">
                        {event.description}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <IconCalendar className="w-4 h-4 text-orange-600" />
                          <span className="text-secondaryTextV1">
                            {formatDate(event.startDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <IconClock className="w-4 h-4 text-purple-600" />
                          <span className="text-secondaryTextV1">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <IconMapPin className="w-4 h-4 text-red-600" />
                          <span className="text-secondaryTextV1 line-clamp-1">
                            {event.location}
                          </span>
                        </div>

                        {event.department && (
                          <div className="flex items-center gap-2 text-sm">
                            <IconUser className="w-4 h-4 text-green-600" />
                            <span className="text-secondaryTextV1">
                              {event.department.name}
                            </span>
                          </div>
                        )}

                        <Button
                          onClick={() => handleViewDetails(event)}
                          className="w-full bg-mainTextHoverV1 hover:bg-primary/90 text-white mt-4"
                        >
                          View Details
                          <IconExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border border-lightBorderV1">
              <CardContent className="p-8 text-center">
                <IconCalendar className="w-12 h-12 text-secondaryTextV1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-mainTextV1 mb-2">
                  No events found
                </h3>
                <p className="text-secondaryTextV1 text-sm">
                  {searchQuery ?
                    "Try adjusting your search terms or filters." :
                    "There are no events available at the moment."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-mainTextV1">
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1">
              Organized by {selectedEvent?.organizer}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedEvent)}
                {selectedEvent.department && (
                  <Badge variant="indigo">
                    {selectedEvent.department.name}
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Description</h4>
                <p className="text-secondaryTextV1 whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-md font-semibold text-mainTextV1 mb-2">Start Date & Time</h4>
                  <p className="text-secondaryTextV1 text-sm">
                    {formatDateTime(selectedEvent.startDate)}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-mainTextV1 mb-2">End Date & Time</h4>
                  <p className="text-secondaryTextV1 text-sm">
                    {formatDateTime(selectedEvent.endDate)}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-mainTextV1 mb-2">Location</h4>
                  <p className="text-secondaryTextV1 text-sm">
                    {selectedEvent.location}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-mainTextV1 mb-2">Organizer</h4>
                  <p className="text-secondaryTextV1 text-sm">
                    {selectedEvent.organizer}
                  </p>
                </div>
              </div>

              {selectedEvent.requirements && (
                <div>
                  <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Requirements</h4>
                  <p className="text-secondaryTextV1 whitespace-pre-wrap">
                    {selectedEvent.requirements}
                  </p>
                </div>
              )}

              {selectedEvent.agenda && (
                <div>
                  <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Agenda</h4>
                  <p className="text-secondaryTextV1 whitespace-pre-wrap">
                    {selectedEvent.agenda}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 