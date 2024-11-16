import { GenderCategory, DesignColor } from './enums';

export interface MockupRequest {
    name: string;
    left: number;
    top: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    angle: number;
    category: string;
    genderCategory: GenderCategory;
    designColor: DesignColor;
    imageFile?: File;
  }

  export interface MockupResponse {
    id: number;
    name: string;
    left: number;
    top: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    angle: number;
    category: string;
    genderCategory: GenderCategory;
    designColor: DesignColor;
    backgroundImagePath: string;
    backgroundImagePreviewPath: string;
    createdAt: Date;
    updatedAt?: Date;
  }

  export interface GenerateRequest {
    mockupIds: number[];
    designFiles: File[];
  }