export type TrackerDate = {
  id: number;
  order: number;
  slug: string;
  title: string;
  increments: number;
  point_value: number;
  max_count: number;
  count_sub_title_singular: string;
  count_sub_title_plural: string;
  points: {
    unit_qty: number;
    unit_points: number;
    total_points: number;
    date: string;
  };
};
