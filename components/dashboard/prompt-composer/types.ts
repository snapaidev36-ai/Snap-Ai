import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';
import type { AuthUser } from '@/lib/types/auth-user';

export type GenerateImageResponse = {
  message: string;
  status: 'processing';
  predictionId: string;
  user: AuthUser;
  usage: {
    id: string;
    prompt: string;
    creditsDeducted: number;
    creditsBefore: number;
    creditsAfter: number;
    aspectRatio: AspectRatioValue;
    style: StyleValue;
    outputImage: string;
    createdAt: string;
  };
  imageUrl: null;
};

export type GenerationRecoveryRecord = {
  usageId: string;
  prompt: string;
  aspectRatio: AspectRatioValue;
  style: StyleValue;
  status: 'processing' | 'completed';
  imageUrl: string | null;
};

export type GenerationStatusResponse = {
  status: 'processing' | 'completed';
  imageUrl: string | null;
  usage: {
    id: string;
    prompt: string;
    creditsDeducted: number;
    creditsBefore: number;
    creditsAfter: number;
    aspectRatio: AspectRatioValue;
    style: StyleValue;
    outputImage: string;
    createdAt: string;
  };
};
