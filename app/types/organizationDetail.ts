export type orgUserDetails = {
  uuid: string;
  first_name: string;
  last_name: string;
  email_verified_at: string;
  avatar: string;
  country: string;
  postal_code: string;
  last_activity_at: string;
  created_at: string;
  has_bounced_email: boolean;
  lifetime_points: number;
  weekly_points: number;
  user_contact_details: {
    facebook_url: string | null;
    instagram_url: string | null;
    email_address: string | null;
    sms: string | null;
  };
  courses: orgUserDetailsCourse[];
  trackers: orgUserDetailsTracker[];
};

type orgUserDetailsCourse = {
  order: number;
  title: string;
  lessons_count: number;
  completed_lessons_count: number;
  lessons: orgUserDetailsLesson[];
};

type orgUserDetailsLesson = {
  order: number;
  title: string;
  completed: boolean;
};

type orgUserDetailsTracker = {
  title: string;
  count_sub_title_plural: string;
  this_month_qty: number;
  last_month_qty: number;
};
