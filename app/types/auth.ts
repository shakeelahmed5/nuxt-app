import type { Country } from './common';

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  country?: Country;
  city?: string;
  password?: string;
  avatar?: string;
  my_why?: string;
  country_id?: number;
  country_name?: string;
  postal_code?: string;
  company_account_name?: string;
  company_account_id?: string;
  user_contact_details?: {
    facebook_url?: string;
    instagram_url?: string;
    email_address?: string;
    sms?: string;
  };
  points_sum?: number;
  position?: number;
};
