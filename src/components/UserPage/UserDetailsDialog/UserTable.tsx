"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/interface/response/user";
import {
  Activity,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { formatDate, formatDateOnly } from "@/utils/dateFormat";

interface UserTableProps {
  user: IUser & {
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      ward?: string;
      district?: string;
      city?: string;
      zipCode?: string;
    };
    studentInfo?: {
      class?: string;
      course?: string;
      academicYear?: string;
      semester?: string;
      gpa?: number;
      credits?: number;
      admissionDate?: string;
      expectedGraduationDate?: string;
      status?: string;
      scholarships?: Array<{
        name: string;
        amount: number;
        year: string;
        semester: string;
      }>;
      achievements?: Array<{
        title: string;
        description: string;
        date: string;
        category: string;
      }>;
    };
    coordinatorInfo?: {
      specialization?: string[];
      researchInterests?: string[];
      qualifications?: Array<{
        degree: string;
        field: string;
        institution: string;
        year: number;
      }>;
      experience?: Array<{
        position: string;
        organization: string;
        startDate: string;
        endDate: string;
        description: string;
      }>;
      publications?: Array<{
        title: string;
        journal: string;
        year: number;
        authors: string[];
      }>;
    };
    profileSettings?: {
      isPublic?: boolean;
      showEmail?: boolean;
      showPhone?: boolean;
      allowMessages?: boolean;
      emailNotifications?: boolean;
    };
    emailVerified?: boolean;
    emailVerifiedAt?: string;
  };
}

export const UserTable = ({ user }: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge variant="cyan">Admin</Badge>;
      case "student":
        return <Badge variant="indigo">Student</Badge>;
      case "coordinator":
        return <Badge variant="blue">Coordinator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="green">
        <Activity className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="red">Inactive</Badge>
    );
  };

  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors">
      <TableCell className="font-semibold text-gray-800 w-1/3">
        {label}
      </TableCell>
      <TableCell className="text-gray-800">{value}</TableCell>
    </TableRow>
  );

  const formatAddress = () => {
    if (!user.address)
      return <span className="text-gray-400">Not provided</span>;
    const { street, ward, district, city, zipCode } = user.address;
    const parts = [street, ward, district, city].filter(Boolean);
    return (
      <div className="space-y-1">
        {parts.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{parts.join(", ")}</span>
          </div>
        )}
        {zipCode && (
          <div className="text-sm text-gray-500 ml-6">Zip Code: {zipCode}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card className="border border-lightBorderV1">
        <CardHeader className="!border-b !border-b-[#ccc]">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-700" />
            <span className="font-semibold text-gray-800">
              Basic Information
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* User Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 border border-slate-300 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`/images/${user.gender ? user.gender : "male"}-${
                    user.role
                  }.webp`}
                  alt={"default-avatar"}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {user.fullName || user.name}
              </h3>
              <p className="text-gray-600 text-sm">@{user.name}</p>
              <div className="flex items-center gap-2 mt-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.active)}
              </div>
            </div>
          </div>

          {/* Basic Info Table */}
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F56C1420]">
                  <TableHead className="font-semibold text-gray-800 w-1/3">
                    Field
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableRow(
                  "Student ID",
                  user.studentId ? (
                    <Badge variant="orange">{user.studentId}</Badge>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )
                )}
                {renderTableRow(
                  "Department",
                  user.department ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="orange">{user.department.code}</Badge>
                      <Badge variant="orange">{user.department.name}</Badge>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )
                )}
                {renderTableRow("Email", user.email)}
                {renderTableRow(
                  "Phone Number",
                  user.phoneNumber || (
                    <span className="text-gray-400">Not provided</span>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      {(user.dateOfBirth || user.gender || user.address) && (
        <Card className="border border-lightBorderV1">
          <CardHeader className="!border-b !border-b-[#ccc]">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-700" />
              <span className="font-semibold text-gray-800">
                Personal Information
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F56C1420]">
                    <TableHead className="font-semibold text-gray-800 w-1/3">
                      Field
                    </TableHead>
                    <TableHead className="font-semibold text-gray-800">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.dateOfBirth &&
                    renderTableRow(
                      "Date of Birth",
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDateOnly(user.dateOfBirth)}</span>
                      </div>
                    )}
                  {user.gender &&
                    renderTableRow(
                      "Gender",
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                        <span className="capitalize">{user.gender}</span>
                      </div>
                    )}
                  {user.address && renderTableRow("Address", formatAddress())}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Information */}
      {user.role === "student" && user.studentInfo && (
        <Card className="border border-lightBorderV1">
          <CardHeader className="!border-b !border-b-[#ccc]">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-700" />
              <span className="font-semibold text-gray-800">
                Student Information
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F56C1420]">
                    <TableHead className="font-semibold text-gray-800 w-1/3">
                      Field
                    </TableHead>
                    <TableHead className="font-semibold text-gray-800">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.studentInfo.class &&
                    renderTableRow(
                      "Class",
                      <Badge variant="blue">{user.studentInfo.class}</Badge>
                    )}
                  {user.studentInfo.course &&
                    renderTableRow(
                      "Course",
                      <Badge variant="indigo">{user.studentInfo.course}</Badge>
                    )}
                  {user.studentInfo.academicYear &&
                    renderTableRow(
                      "Academic Year",
                      user.studentInfo.academicYear
                    )}
                  {user.studentInfo.semester &&
                    renderTableRow("Semester", user.studentInfo.semester)}
                  {user.studentInfo.gpa !== undefined &&
                    renderTableRow(
                      "GPA",
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            user.studentInfo.gpa >= 3.0 ? "green" : "orange"
                          }
                        >
                          {user.studentInfo.gpa.toFixed(2)}
                        </Badge>
                      </div>
                    )}
                  {user.studentInfo.credits !== undefined &&
                    renderTableRow(
                      "Credits",
                      `${user.studentInfo.credits} credits`
                    )}
                  {user.studentInfo.admissionDate &&
                    renderTableRow(
                      "Admission Date",
                      formatDateOnly(user.studentInfo.admissionDate)
                    )}
                  {user.studentInfo.expectedGraduationDate &&
                    renderTableRow(
                      "Expected Graduation",
                      formatDateOnly(user.studentInfo.expectedGraduationDate)
                    )}
                  {user.studentInfo.status &&
                    renderTableRow(
                      "Status",
                      <Badge variant="green" className="capitalize">
                        {user.studentInfo.status}
                      </Badge>
                    )}
                </TableBody>
              </Table>
            </div>

            {/* Scholarships */}
            {user.studentInfo.scholarships &&
              user.studentInfo.scholarships.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Scholarships
                  </h4>
                  <div className="space-y-2">
                    {user.studentInfo.scholarships.map((scholarship, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">
                            {scholarship.name}
                          </span>
                          <Badge variant="green">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(scholarship.amount)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {scholarship.year} - {scholarship.semester}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Achievements */}
            {user.studentInfo.achievements &&
              user.studentInfo.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Achievements
                  </h4>
                  <div className="space-y-2">
                    {user.studentInfo.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-800">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-sm">
                            {achievement.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDateOnly(achievement.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Coordinator Information */}
      {user.role === "coordinator" && user.coordinatorInfo && (
        <Card className="border border-lightBorderV1">
          <CardHeader className="!border-b !border-b-[#ccc]">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-700" />
              <span className="font-semibold text-gray-800">
                Coordinator Information
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {user.coordinatorInfo.specialization &&
              user.coordinatorInfo.specialization.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Specialization
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.coordinatorInfo.specialization.map((spec, index) => (
                      <Badge key={index} variant="blue">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {user.coordinatorInfo.researchInterests &&
              user.coordinatorInfo.researchInterests.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Research Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.coordinatorInfo.researchInterests.map(
                      (interest, index) => (
                        <Badge key={index} variant="purple">
                          {interest}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

            {user.coordinatorInfo.qualifications &&
              user.coordinatorInfo.qualifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Qualifications
                  </h4>
                  <div className="space-y-2">
                    {user.coordinatorInfo.qualifications.map((qual, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-800">
                          {qual.degree} in {qual.field}
                        </div>
                        <div className="text-sm text-gray-600">
                          {qual.institution} - {qual.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {user.coordinatorInfo.experience &&
              user.coordinatorInfo.experience.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Experience
                  </h4>
                  <div className="space-y-2">
                    {user.coordinatorInfo.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-800">
                          {exp.position}
                        </div>
                        <div className="text-sm text-gray-600">
                          {exp.organization}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatDateOnly(exp.startDate)} -{" "}
                          {exp.endDate
                            ? formatDateOnly(exp.endDate)
                            : "Present"}
                        </div>
                        {exp.description && (
                          <div className="text-sm text-gray-600 mt-2">
                            {exp.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {user.coordinatorInfo.publications &&
              user.coordinatorInfo.publications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Publications
                  </h4>
                  <div className="space-y-2">
                    {user.coordinatorInfo.publications.map((pub, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-800">
                          {pub.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {pub.journal}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {pub.year}
                          </span>
                          {pub.authors && pub.authors.length > 0 && (
                            <span className="text-sm text-gray-500">
                              • {pub.authors.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
