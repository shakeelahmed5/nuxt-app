import type { TeamInvite } from '~/types/common';
import { z } from 'zod';
import type { FormSubmitEvent, Form } from '#ui/types';

export const useTeamInvite = () => {
  const toast = useToast();
  const errorHandle = useErrorHandler();
  const sanctumFetch = useSanctumClient();
  const { confirm, isLoading: loading, confirming } = useConfirm();
  const invites = useState<TeamInvite[]>('teamInvitesList');
  const isLoading = useState<boolean>('teamInvitesIsLoading', () => false);

  const schema = z.object({
    first_name: z.string().min(1, { message: 'First Name is required' }),
    last_name: z.string().min(1, { message: 'Last Name is required' }),
    country_id: z.number().min(1, { message: 'Country is required' }),
  });

  type Schema = z.output<typeof schema>;

  const form = useState<Form<Schema>>('teamInviteFormEl');
  const state = useState<Schema>('teamInviteForm', () => ({
    first_name: '',
    last_name: '',
    country_id: 0,
  }));

  const getInvites = async () => {
    await sanctumFetch('/api/invite-codes')
      .then((res) => {
        invites.value = res.data;
        if (invites.value.length && invites.value[0] !== undefined) {
            invites.value[0].defaultOpen = true;
        }
      })
      .catch(() => {});
  };

  const save = async (event: FormSubmitEvent<Schema>) => {
    form.value?.clear();

    try {
      isLoading.value = true;
      await sanctumFetch('/api/invite-codes', {
        method: 'POST',
        body: event.data,
      })
        .then(async(res) => {
            await getInvites();
          state.value.first_name = '';
          state.value.last_name = '';
          state.value.country_id = 0;

          toast.add({
            title: 'Invite Code Success',
            description: 'We have created the invite code!',
            color: 'green',
          });
          isLoading.value = false;
          document.getElementById('team-inite-list')?.scrollIntoView({behavior: 'smooth'});
        })
        .catch((err) => {
          isLoading.value = false;
          errorHandle.handle(err, form);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInvite = async (invite: TeamInvite) => {
    confirm(
      'Are you sure you want to delete this invite?',
      'This action cannot be undone.  This will permanently delete this invite.',
      'Delete Invite',
      async () => {
        loading.value = true;
        await sanctumFetch(`/api/invite-codes/${invite.id}`, {
          method: 'delete',
        })
          .then((res) => {
            toast.add({
              title: 'Deleted!',
              description: 'Invite has been deleted successfully',
              color: 'green',
            });
            loading.value = false;
            confirming.value = false;
            getInvites();
          })
          .catch((err) => {
            loading.value = false;
            errorHandle.handle(err);
          });
      }
    );
  };

  return {
    isLoading,
    invites,
    getInvites,
    deleteInvite,
    form,
    save,
    state,
    schema,
  };
};
