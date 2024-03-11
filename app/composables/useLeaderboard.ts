import dayjs from '#build/dayjs.imports.mjs';
import type { User } from '~/types/auth';

export const useLeaderboad = () => {
  const sanctum = useSanctumClient();

  const topUsers = useState<User[]>('topUsers-leaderboard', () => []);
  const isLoading = useState<boolean>('topUsers-isLoading', () => false);

  type startEnd = {
    start: Date;
    end: Date;
  };

  type DatesObject = {
    thisWeek: startEnd;
    lastWeek: startEnd;
    thisMonth: startEnd;
    lastMonth: startEnd;
  };

  const dates = {
    thisWeek: {
      start: dayjs().startOf('week'),
      end: dayjs().endOf('week'),
    },
    lastWeek: {
      start: dayjs().subtract(1, 'week').startOf('week'),
      end: dayjs().subtract(1, 'week').endOf('week'),
    },
    thisMonth: {
      start: dayjs().startOf('month'),
      end: dayjs().endOf('month'),
    },
    lastMonth: {
      start: dayjs().subtract(1, 'month').startOf('month'),
      end: dayjs().subtract(1, 'month').endOf('month'),
    },
  };
  const getUsers = async (page: keyof DatesObject) => {
    isLoading.value = true;
    const { start, end } = dates[page];
    const response = await sanctum(
      `api/leaderboard?period_from=${start.format(
        'YYYY-MM-DD'
      )}&period_to=${end.format('YYYY-MM-DD')}`
    );

    topUsers.value = response.data;
    isLoading.value = false;
  };

  const getDateString = (page: keyof DatesObject) => {
    const { start } = dates[page];
    return start;
  };

  return {
    getUsers,
    topUsers,
    getDateString,
    isLoading,
  };
};
