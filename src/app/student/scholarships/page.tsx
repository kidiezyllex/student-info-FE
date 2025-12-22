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
import { IconSearch, IconGift, IconCalendarMonthFilled, IconCurrencyDollar, IconFilter, IconExternalLink, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IScholarship } from "@/interface/response/scholarship";
import Image from "next/image";
import { Activity } from "lucide-react";

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

  const handleClearSearch = () => {
    setSearchQuery("");
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
      return <Badge variant="red">Expired</Badge>;
    }

    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysLeft <= 7) {
      return <Badge variant="orange">Ending Soon</Badge>;
    }

    return <Badge variant="green"><Activity className="h-3 w-3" />Active</Badge>;
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
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
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
                  className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-gray-800"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <IconFilter className="w-5 h-5 text-gray-800" />
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
          ) : filteredScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors h-full flex flex-col">
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
                      <p className="text-sm text-gray-800 line-clamp-3 mb-4">
                        {scholarship.description}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <IconCurrencyDollar className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-800">
                            {scholarship.value}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <IconCalendarMonthFilled className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-800">
                            Deadline: {formatDate(scholarship.applicationDeadline)}
                          </span>
                        </div>

                        {scholarship.department && (
                          <div className="flex items-center gap-2 text-sm">
                            <IconGift className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-800">
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
                <IconGift className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No scholarships found
                </h3>
                <p className="text-gray-800 text-sm">
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

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800 flex items-center gap-2">
            {selectedScholarship && getStatusBadge(selectedScholarship)} {selectedScholarship?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-800">
              Provided by {selectedScholarship?.provider}
            </DialogDescription>
          </DialogHeader>

          {selectedScholarship && (
            <div className="space-y-4">
              <div className="w-full overflow-auto">
                <Table className="border border-lightBorderV1">
                  <TableHeader>
                    <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-800 text-nowrap w-1/3">Field</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-nowrap">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold text-gray-800 bg-gray-50">Scholarship Value</TableCell>
                      <TableCell className="text-gray-800">
                        <span className="text-xl font-semibold text-green-600">
                          {selectedScholarship.value}
                        </span>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold text-gray-800 bg-gray-50">Application Deadline</TableCell>
                      <TableCell className="text-gray-800">
                        {formatDate(selectedScholarship.applicationDeadline)}
                      </TableCell>
                    </TableRow>

                    {selectedScholarship.department && (
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-semibold text-gray-800 bg-gray-50">Department</TableCell>
                        <TableCell className="text-gray-800">
                          {selectedScholarship.department.name}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold text-gray-800 bg-gray-50 align-top">Description</TableCell>
                      <TableCell className="text-gray-800 whitespace-pre-wrap">
                        {selectedScholarship.description}
                      </TableCell>
                    </TableRow>

                    {selectedScholarship.eligibility && (
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-semibold text-gray-800 bg-gray-50 align-top">Eligibility</TableCell>
                        <TableCell className="text-gray-800 whitespace-pre-wrap">
                          {selectedScholarship.eligibility}
                        </TableCell>
                      </TableRow>
                    )}

                    {selectedScholarship.requirements && (
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-semibold text-gray-800 bg-gray-50 align-top">Requirements</TableCell>
                        <TableCell className="text-gray-800 whitespace-pre-wrap">
                          {selectedScholarship.requirements}
                        </TableCell>
                      </TableRow>
                    )}

                    {selectedScholarship.applicationProcess && (
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-semibold text-gray-800 bg-gray-50 align-top">Application Process</TableCell>
                        <TableCell className="text-gray-800 whitespace-pre-wrap">
                          {selectedScholarship.applicationProcess}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 