"use client";

import { useState } from "react";
import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RoleSection } from "@/components/team/RoleSection";
import { MemberDialog } from "@/components/team/MemberDialog";
import { FadeIn } from "@/components/animations/FadeIn";
import { Member } from "@/lib/types";
import { getRoleGroups } from "@/lib/data/members";

export default function TeamPage() {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const roleGroups = getRoleGroups();

    return (
        <div className="py-12 pt-28 md:py-16 md:pt-32">
            <div className="container-custom">
                <FadeIn>
                    <SectionHeader
                        title="Notre équipe"
                        description="Rencontrez les créateurs passionnés qui composent Fulguria Team. Chacun apporte son expertise et sa créativité pour produire des contenus visuels d'exception."
                        centered
                    />
                </FadeIn>

                {/* Role sections */}
                <div className="mt-8 md:mt-12">
                    {roleGroups.map((group) => (
                        <RoleSection
                            key={group.role}
                            role={group.role}
                            description={group.description}
                            members={group.members}
                            onMemberClick={setSelectedMember}
                        />
                    ))}
                </div>
            </div>

            {/* Member Dialog */}
            <MemberDialog
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
}
