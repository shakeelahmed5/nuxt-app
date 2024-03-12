export const useUtils = () => {
  const config = useRuntimeConfig();
  const toast = useToast();

  const asset = (url: string | undefined) => {
    if (!url) return;

    if (url.includes('http://') || url.includes('https://')) {
      return url;
    }
    return config.public.assets_url + url;
  };

  const sleep = async (time: number) => {
    await setTimeout(() => {}, time);
  };

  const fallbackCopyTextToClipboard = (text: string, message: string) => {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');

      if (successful) {
        toast.add({
          title: 'Copied!',
          description: message,
          color: 'green',
        });
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };
  const copyTextToClipboard = (
    text: string,
    message = 'Text is copied to the clipboard'
  ) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text, message);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        toast.add({
          title: 'Copied!',
          description: message,
          color: 'green',
        });
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      }
    );
  };

  return {
    asset,
    sleep,
    copyTextToClipboard,
  };
};
