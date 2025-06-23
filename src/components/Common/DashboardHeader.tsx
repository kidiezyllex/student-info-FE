"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import { IconChevronsLeft, IconChevronsRight, IconHomeFilled } from "@tabler/icons-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

declare global {
	interface Window {
		ethereum?: any;
	}
}

export default function DashboardHeader() {
	const { toggle } = useMenuSidebar();
	const { isOpen } = useMenuSidebar();
	const [searchTerm, setSearchTerm] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const { data: userProfile } = useGetUserProfile();
	const username = userProfile?.data?.user?.name || "User";
	const isLoading = false;
	const { logoutUser } = useUser();
	const handleSearchSubmit = () => {
	};
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm((e.target as HTMLInputElement).value);
	};
	return (
		<>
			<div
				className="w-full fixed top-0 left-0 right-0 z-50
      p-4 px-6 bg-mainDarkBackgroundV1 border-b border-b-darkBorderV1 flex justify-between items-center h-[78px]"
			>
				<div className="flex items-center w-[244px] justify-between">
					<Link href="/">
						<Image 
						height={300}
						width={300}
						draggable={false}
						quality={100}
						src="/images/logo.svg" alt="logo" className="w-auto h-8" />
					</Link>
					<Button
						variant="ghost"
						size="icon"
						onClick={toggle}
						className="bg-[#29323A] hover:bg-[#29323A]/80 !text-white/70 h-7 w-7"
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
								className="w-[90%] h-9 text-maintext pr-10 border-none focus:!outline-none focus:!ring-0 focus:!border-none !bg-transparent text-mainTextV1"
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
					<ActionIcon variant="ghost" size="default" className="mr-1">
						<Bell className="text-mainTextV1" size={24} />
					</ActionIcon>
					<ActionIcon variant="ghost" size="default" className="mr-1">
						<Settings className="text-mainTextV1" size={24} />
					</ActionIcon>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<div className="cursor-pointer">
								<Avatar className="w-10 h-10 p-1 border border-lightBorderV1 bg-white">
									<AvatarImage src={"/images/sample-img.png"} alt={username} />
									<AvatarFallback>{username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
								</Avatar>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 mt-4">
							<div className="px-3 py-2 text-sm text-mainTextV1 font-semibold select-none">
								Xin chào, {username}
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="gap-2 text-mainTextV1 font-medium">
								<User className="w-4 h-4" />
								Tài khoản
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-2 text-red-500 font-medium" onClick={logoutUser}>
								<LogOut className="w-4 h-4" />	
								Đăng xuất
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

				</div>
			</div>
		</>
	);
}
