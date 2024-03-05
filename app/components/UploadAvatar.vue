<template>
        <!-- Integrate avatar-cropper component -->
        <VueAvatarCropper
          v-model="openCropper"
          upload-url="" 
          :upload-handler="handleUpload"  
          @uploading="handleUploading"        
          @error="handleError"
        />
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import VueAvatarCropper from 'vue-avatar-cropper';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: false,
    },
    userAvatar: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/739984?v=4",
    },
  });

  
  const emit = defineEmits(['update:isOpen', 'image-url']);
  
  const openCropper = ref(false);
  const croppedImage = ref(null); // Initialize to null to handle empty states

  
  function closeModal() {
    console.log('close modal');
    emit('update:isOpen', false);
  }
  
  function handleUpload(cropper) {

    emit('image-url', cropper.getCroppedCanvas())

  }

function handleUploading(){
    console.log('dhsghschsg');
}
  
  function handleError({ message, type, context }) {
    console.error('Upload error', { message, type, context });
    if (type === 'upload') {
      const { request, response } = context;
      // Handle specific upload errors here
    }
  }
  
  watch(() => props.isOpen, (newVal) => {
    console.log('newVal', newVal);
    openCropper.value = newVal;
  });
  
  </script>
  
  <style scoped>
  /* Add any custom styles if needed */
  </style>
  