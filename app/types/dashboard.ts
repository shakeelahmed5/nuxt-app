export type Dashboard = {
  welcome_message: boolean;
  sponsor?: {
    first_name: string;
    last_name: string;
    avatar: string;
  };
  weekly_points: number;
  lifetime_points: number;
  email_verified_at: string;
  heatmap: [
    {
      date: string;
      count: number;
    }
  ];
  next_achievement: {
    name: string;
    description: string;
    badge_url: string;
  };
  has_bounced_email: boolean;
  current_learning_streak: number;
  longest_learning_streak: number;
};
