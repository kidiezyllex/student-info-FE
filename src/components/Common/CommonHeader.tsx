"use client";

import { Button } from "@/components/ui/button";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfile } from "@/hooks/useUser";
import { User, LogOut } from "lucide-react";
import { useUser } from "@/context/useUserContext";
import Image from "next/image";

export default function CommonHeader() {
  const { toggle } = useMenuSidebar();
  const { isOpen } = useMenuSidebar();
  const { data: userProfile } = useGetUserProfile();
  const { logoutUser } = useUser();

  const pathname = usePathname();

  const username = userProfile?.data?.name || "User";

  const getHomeRoute = () => {
    const role = userProfile?.data?.role;
    switch (role) {
      case "student":
        return "/student";
      case "admin":
        return "/admin";
      case "coordinator":
        return "/coordinator";
      default:
        return "/";
    }
  };

  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 p-4 px-4 bg-mainDarkBackgroundV1 border-b border-b-darkBorderV1 flex justify-between items-center h-[80px]">
      {!pathname?.startsWith("/student") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="bg-[#29323A] rounded-full hover:bg-[#29323A]/80 text-white/70 hover:text-white !h-10 !w-10 transition-colors duration-100"
        >
          <IconMenu2
            size={24}
            className="text-mainActiveV1 !h-5 !w-5 hover:text-white"
          />
        </Button>
      )}
      <Link
        href={getHomeRoute()}
        className="relative flex items-center justify-center"
        suppressHydrationWarning
      >
        <Image
          height={500}
          width={500}
          draggable={false}
          quality={100}
          src="/images/vgu-logo2.webp"
          alt="vgu-logo"
          className="w-auto h-28 object-contain -translate-y-2"
        />
        <p className="text-neutral-200 -translate-y-5 absolute bottom-0 text-nowrap font-semibold uppercase text-lg text-center">
          Vietnamese–German University
        </p>
      </Link>
      <div className="flex items-center gap-2 ">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <div className="h-11 w-11 flex-shrink-0 border border-slate-300 rounded-full overflow-hidden cursor-pointer bg-slate-100">
              <Image
                draggable={false}
                quality={100}
                src={
                  `/images/${
                    userProfile?.data?.gender
                      ? userProfile?.data?.gender
                      : "male"
                  }-${
                    userProfile?.data?.role
                      ? userProfile?.data?.role
                      : "student"
                  }.webp` || "/images/student.webp"
                }
                alt={"default-avatar"}
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4">
            <div className="px-3 py-2 text-[13px] text-gray-800 font-semibold select-none">
              Hello, {username}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-gray-800 font-semibold">
              <User className="w-4 h-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-500 font-semibold"
              onClick={logoutUser}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
