"use client";

import { useEffect, useState } from "react";
import { useGetActiveScholarships, useGetAllScholarships } from "@/hooks/useScholarship";
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
import { IconSearch, IconGift, IconCalendar, IconCurrencyDollar, IconFilter, IconExternalLink } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IScholarship } from "@/interface/response/scholarship";
import Image from "next/image";

type ScholarshipFilter = "all" | "active";

export default function StudentScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scholarshipFilter, setScholarshipFilter] = useState<ScholarshipFilter>("active");
  const [selectedScholarship, setSelectedScholarship] = useState<IScholarship | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filteredScholarships, setFilteredScholarships] = useState<IScholarship[]>([]);

  const { data: activeScholarshipsData, isLoading: isLoadingActive } = useGetActiveScholarships();
  const { data: allScholarshipsData, isLoading: isLoadingAll } = useGetAllScholarships();

  const isLoading = scholarshipFilter === "active" ? isLoadingActive : isLoadingAll;
  const scholarshipsData = scholarshipFilter === "active" ? activeScholarshipsData : allScholarshipsData;

  useEffect(() => {
    if (scholarshipsData?.data) {
      let filtered = scholarshipsData.data;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(scholarship =>
          scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (scholarship.department && scholarship.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setFilteredScholarships(filtered);
    } else {
      setFilteredScholarships([]);
    }
  }, [scholarshipsData, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: ScholarshipFilter) => {
    setScholarshipFilter(value);
  };

  const handleViewDetails = (scholarship: IScholarship) => {
    setSelectedScholarship(scholarship);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (scholarship: IScholarship) => {
    const now = new Date();
    const deadline = new Date(scholarship.applicationDeadline);

    if (deadline < now) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-100">
          Expired
        </Badge>
      );
    }

    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysLeft <= 7) {
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-100/50">
          Ending Soon
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100/50">
        Active
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scholarships</BreadcrumbPage>
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
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
              </div>

              <div className="flex items-center gap-2">
                <IconFilter className="w-5 h-5 text-mainTextV1" />
                <Select value={scholarshipFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active scholarships</SelectItem>
                    <SelectItem value="all">All scholarships</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scholarships Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="border border-lightBorderV1">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors h-full flex flex-col">
                    <CardHeader
                      className="relative bg-black h-32"
                    >
                      <Image
                        src="/images/school-bg.png"
                        alt="school-bg"
                        fill
                        className="object-cover absolute opacity-40 z-0"
                      />
                      <div className="flex-1 flex flex-col absolute z-10 gap-2">
                        <CardTitle className="text-base text-white line-clamp-2">
                          {scholarship.title}
                        </CardTitle>
                        <CardDescription className="text-white font-normal">
                          {scholarship.provider}
                        </CardDescription>
                        {getStatusBadge(scholarship)}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-secondaryTextV1 line-clamp-3 mb-4">
                        {scholarship.description}
                      </p>

                      <div className="space-y-3 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <IconCurrencyDollar className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-mainTextV1">
                            {scholarship.value}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <IconCalendar className="w-4 h-4 text-blue-600" />
                          <span className="text-secondaryTextV1">
                            Deadline: {formatDate(scholarship.applicationDeadline)}
                          </span>
                        </div>

                        {scholarship.department && (
                          <div className="flex items-center gap-2 text-sm">
                            <IconGift className="w-4 h-4 text-purple-600" />
                            <span className="text-secondaryTextV1">
                              {scholarship.department.name}
                            </span>
                          </div>
                        )}

                        <Button
                          onClick={() => handleViewDetails(scholarship)}
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
                <IconGift className="w-12 h-12 text-secondaryTextV1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-mainTextV1 mb-2">
                  No scholarships found
                </h3>
                <p className="text-secondaryTextV1">
                  {searchQuery ?
                    "Try adjusting your search terms or filters." :
                    "There are no scholarships available at the moment."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Scholarship Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-mainTextV1">
              {selectedScholarship?.title}
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1">
              Provided by {selectedScholarship?.provider}
            </DialogDescription>
          </DialogHeader>

          {selectedScholarship && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedScholarship)}
                <span className="text-2xl font-bold text-green-600">
                  {selectedScholarship.value}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Description</h4>
                <p className="text-secondaryTextV1 whitespace-pre-wrap">
                  {selectedScholarship.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-md font-semibold text-mainTextV1 mb-2">Application Deadline</h4>
                  <p className="text-secondaryTextV1">
                    {formatDate(selectedScholarship.applicationDeadline)}
                  </p>
                </div>

                {selectedScholarship.department && (
                  <div>
                    <h4 className="text-md font-semibold text-mainTextV1 mb-2">Department</h4>
                    <p className="text-secondaryTextV1">
                      {selectedScholarship.department.name}
                    </p>
                  </div>
                )}
              </div>

              {selectedScholarship.requirements && (
                <div>
                  <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Requirements</h4>
                  <p className="text-secondaryTextV1 whitespace-pre-wrap">
                    {selectedScholarship.requirements}
                  </p>
                </div>
              )}

              {selectedScholarship.applicationProcess && (
                <div>
                  <h4 className="text-lg font-semibold text-mainTextV1 mb-2">Application Process</h4>
                  <p className="text-secondaryTextV1 whitespace-pre-wrap">
                    {selectedScholarship.applicationProcess}
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