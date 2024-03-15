import type { FormSubmitEvent, Form } from '#ui/types';
import { z } from 'zod';

export const useProfile = () => {
  const sanctumFetch = useSanctumClient();
  const { handle: errorHandle } = useErrorHandler();
  const { refreshIdentity } = useSanctumAuth();
  const toast = useToast();
  type Schema = z.output<typeof schema>;
  const isLoading = useState<boolean>('profileIsLoading', () => false);
  const form = useState<Form<Schema>>('profileForm');
  const croppedImageCanvas = useState<HTMLCanvasElement | null>(
    'croppedImageCanvas',
    () => null
  );

  const assignBlob = async (canvas: HTMLCanvasElement, formData: FormData) => {
    await new Promise<void>((resolve) => {
      canvas?.toBlob((blob) => {
        if (blob) {
          formData.append('avatar', blob);
        } else {
          console.warn('No avatar blob to append'); // Warning if blob doesn't exist
        }
        resolve();
      });
    });

    return formData;
  };

  const schema = z.object({
    avatar: z.string(),
    email: z.string().email('Invalid email'),
    first_name: z.string().min(3, 'Must be at least 3 characters'),
    last_name: z.string().min(3, 'Must be at least 3 characters'),
    city: z.string().min(3, 'Must be at least 3 characters'),
    // country: z.object({value:z.number(), name:z.string()}), // Will have to check why it is not validating
    country_id: z.number(),
    postal_code: z.string().min(2, 'Postal code is required'),
    my_why: z.string(),
    company_account_name: z.string().min(1, 'Name on account is required'),
  });

  const save = async (event: FormSubmitEvent<Schema>) => {
    // Create FormData object to send with the request
    const formData = new FormData();

    // Add all form fields except 'avatar' directly from the form data
    Object.keys(event.data).forEach((key) => {
      if (key !== 'avatar') {
        // Avoid appending 'avatar' here
        formData.append(key, (event.data as any)[key]); // Use 'as any' to bypass TypeScript issues
      }
    });

    // Conditional handling of avatar:
    if (croppedImageCanvas.value) {
      await assignBlob(croppedImageCanvas.value, formData);
    } else if (event.data?.avatar) {
      formData.append('avatar', event.data?.avatar);
    }

    try {
      isLoading.value = true;
      await sanctumFetch(`/api/update-user-general-details`, {
        method: 'POST',
        body: formData,
      })
        .then(async (res) => {
          isLoading.value = false;

          await refreshIdentity();
          toast.add({
            title: 'Success',
            description: res.success,
            color: 'green',
          });
        })
        .catch((err) => {
          isLoading.value = false;
          errorHandle(err, form);
        });
    } catch (error) {
      console.log('complete error', error);
      const err = useSanctumError(error);

      if (err.isValidationError) {
        // form.value?.setErrors(err.bag);
      }
    }
  };

  return {
    assignBlob,
    save,
    form,
    schema,
    isLoading,
    croppedImageCanvas,
  };
};
