"use client";

import { Member } from "@/lib/types";
import { MemberCard } from "./MemberCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

interface RoleSectionProps {
    role: string;
    description?: string;
    members: Member[];
    onMemberClick: (member: Member) => void;
}

export function RoleSection({
    role,
    description,
    members,
    onMemberClick,
}: RoleSectionProps) {
    if (members.length === 0) return null;

    return (
        <section className="mb-16">
            {/* Section header */}
            <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {role}
                </h3>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>

            {/* Members grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {members.map((member) => (
                    <StaggerItem key={member.id}>
                        <MemberCard member={member} onClick={() => onMemberClick(member)} />
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
