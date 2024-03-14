export type Country = {
  value?: number;
  name?: string;
};

export type TeamInvite = {
  id: number;
  code: string;
  first_name: string;
  last_name: string;
  used_at?: null | string;
  created_at: string;
  deleted_at: null | string;
  defaultOpen?: boolean;
};
