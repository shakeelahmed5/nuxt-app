const confirming = ref<boolean>(false)

interface ConfirmParams {
  title: string
  message: string
  label: string
  action: Function
}

const params = ref<ConfirmParams>({
  title: 'Title',
  message: 'Description',
  label: 'Confirm',
  action: () => {},
})

const isLoading = ref<boolean>(false);

export const useConfirm = () => {
  function confirm (title: string, message: string, label: string, action: Function) {
    params.value = { title, message, label, action }
    confirming.value = true
  }

  return {
    confirm,
    confirming,
    params,
    isLoading,
  }
}