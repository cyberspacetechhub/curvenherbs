import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '@/api';

export const useUploadImage = () =>
  useMutation({ mutationFn: ({ file, folder }: { file: File; folder?: string }) => uploadApi.upload(file, folder).then(r => r.data.data) });

export const useDeleteImage = () =>
  useMutation({ mutationFn: (publicId: string) => uploadApi.delete(publicId) });
