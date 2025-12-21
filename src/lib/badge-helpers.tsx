import { Badge } from "@/components/ui/badge";

export function getRoleBadge(role: string) {
	switch (role.toLowerCase()) {
		case 'admin':
			return <Badge variant="cyan">Admin</Badge>;
		case 'student':
			return <Badge variant="indigo">Student</Badge>;
		case 'coordinator':
			return <Badge variant="blue">Coordinator</Badge>;
		default:
			return <Badge variant="slate" className="capitalize">{role}</Badge>;
	}
}

