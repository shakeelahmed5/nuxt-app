
export type Achievement = {
    awarded_at: string;
    badge_url: string;
    claimable: boolean;
    description: string;
    id: number;
    is_awarded: boolean;
    name: string;
    order: number;
    pending_approval_count: number;
    requires_approval: boolean;
    is_approved: boolean;
}