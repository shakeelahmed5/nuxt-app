import type { User } from '~~/models/user';

export default defineNuxtRouteMiddleware((to, from) => {
  const sanctumConfig = useSanctumConfig();

  const { isAuthenticated, user } = useSanctumAuth<User>();

  if (isAuthenticated.value) {
    window._paq.push(['setUserId', user.value?.id.toString()]);
    console.log('user_id:  ', user.value?.id.toString());
  }
});
