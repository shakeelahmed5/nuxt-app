export type OrgUser = {
  id: number;
  parent_id: number;
  uuid: string;
  avatar: string;
  full_name: string;
  last_activity_at: string;
  level: number;
  path: string;
  hasDecendants?: boolean;
};
