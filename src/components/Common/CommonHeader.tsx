"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfile } from "@/hooks/useUser";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { useUser } from "@/context/useUserContext";
import Image from "next/image";

export default function CommonHeader() {
	const { toggle } = useMenuSidebar();
	const { isOpen } = useMenuSidebar();
	const [searchTerm, setSearchTerm] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const { data: userProfile } = useGetUserProfile();
	const isLoading = false;
	const { logoutUser } = useUser();
	
	const username = userProfile?.data?.name || "User";

	const handleSearchSubmit = () => {
	};
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm((e.target as HTMLInputElement).value);
	};
	return (
		<>
			<div
				className="w-full fixed top-0 left-0 right-0 z-50
      p-4 px-4 bg-mainDarkBackgroundV1 border-b border-b-darkBorderV1 flex justify-between items-center h-[78px]"
			>
				<div className="flex items-center w-[244px] justify-between">
					<Link href="/" className="block" suppressHydrationWarning>
						<span className="block">
							<Image 
							height={500}
							width={500}
							draggable={false}
							quality={100}
							src="/images/vgu-logo2.webp" alt="vgu-logo" className="w-auto h-24 object-contain" />
						</span>
					</Link>
					<Button
						variant="ghost"
						size="icon"
						onClick={toggle}
						className="bg-[#29323A] hover:bg-[#29323A]/80 !text-white/70 !h-8 !w-8"
					>
						{isOpen ? (
							<IconChevronsLeft size={24} className="text-mainActiveV1 !h-5 !w-5" />
						) : (
							<IconChevronsRight size={24} className="text-mainActiveV1 !h-5 !w-5" />
						)}
					</Button>
				</div>
				<div className="relative hidden md:block">
					<form onSubmit={handleSearchSubmit} className="relative flex items-center gap-4">
						<div className="relative w-[440px] flex justify-between items-center border border-mainTextV1 rounded-sm bg-transparent">
							<Input
								ref={inputRef}
								placeholder="Search..."
								className="w-[90%] text-maintext pr-10 border-none focus:!outline-none focus:!ring-0 focus:!border-none !bg-transparent text-gray-800"
								value={searchTerm}
								onChange={handleSearchChange}
								disabled={isLoading}
							/>
							{isLoading && (
								<Icon
									path={mdiLoading}
									size={0.8}
									spin
									className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-mainActiveV1"
								/>
							)}
						</div>
						<button type="submit" style={{ display: "none" }} aria-hidden="true"></button>
					</form>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<div className="h-11 w-11 flex-shrink-0 border border-slate-300 rounded-full overflow-hidden cursor-pointer bg-slate-100">
								<Image 
								draggable={false}
								quality={100}
								src={`/images/${userProfile?.data?.gender ? userProfile?.data?.gender : "male"}-${userProfile?.data?.role ? userProfile?.data?.role : "student"}.webp` || "/images/student.webp"} alt={"default-avatar"} className="object-cover h-full w-full" width={100} height={100}/>
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
							<DropdownMenuItem className="gap-2 text-red-500 font-semibold" onClick={logoutUser}>
								<LogOut className="w-4 h-4" />	
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

				</div>
			</div>
		</>
	);
}
