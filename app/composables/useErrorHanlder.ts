export const useErrorHandler = () => {
  const toast = useToast();

  type ErrorObject = {
    data: {
      errors: {
        [key: string]: [string];
      };
      message: string;
    },
    statusCode: number;
  }

  const handleValidationErrors = (form: Ref, err: ErrorObject) => {
    form.value.setErrors(
      Object.keys(err.data.errors).map((path) => ({
        // Map validation errors to { path: string, message: string }
        message: err.data.errors?.[path]?.[0],
        path,
      }))
    );
  }
  const handle = (err: ErrorObject, form?: Ref) => {
    if (err.statusCode === 401) {
      useRouter().push('/login');
      return;
    }
    toast.add({
      title: 'Error',
      description: err.data.message,
      color: 'red',
    });
    if (err.statusCode === 422 && form?.value) {
      handleValidationErrors(form, err);
    }
  };

  return {
    handle,
  }
};
