/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum ResourceStatus {
  Undownload = 1,
  Downloaded = 2,
  CanDownload = 3,
  DontLike = 4,
  Failed = 5,
}

export enum ImageType {
  Jpeg = "jpeg",
  Png = "png",
  Gif = "gif",
  Webp = "webp",
}

export enum DirectionCategory {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
  Column = "Column",
}

export enum WorkspaceOperation {
  Open = "Open",
  Trash = "Trash",
  Clear = "Clear",
}

export enum ResourceType {
  File = "File",
  Folder = "Folder",
}

export interface RespResource {
  path: string;
  name: string;
  type: ResourceType;
  size?: string;
}

export interface RespWorkspace {
  key: string;
  path: string;
  trash: string;
  isActive: boolean;
}

export interface OperateWorkspaceDto {
  workspace: string;
  folder?: string;
  operation?: WorkspaceOperation;
}

export interface MergeImageDto {
  file: File[];
  filename?: string[];
  /** @default "Horizontal" */
  direction?: DirectionCategory;
  /** @default 1 */
  columns?: number;
  /** @default "png" */
  outputType?: ImageType;
}

export interface RespMisskonTag {
  id: number;
  name: string;
  url: string;
  like: number;
  count: number;
}

export interface UpdateMisskonTagDto {
  like: number;
}

export interface UpdateMisskonDto {
  status?: ResourceStatus;
}

export interface ListImageParams {
  workspace: string;
  folder?: string;
}

export interface RemoveImageParams {
  workspace: string;
  image: string;
  /** @default 1 */
  count?: number;
}

export interface ListMisskonTagParams {
  like?: number;
  page?: number;
  pageSize?: number;
  name?: string;
  status?: ResourceStatus;
}

export interface UpdateMisskonTagParams {
  id: number;
}

export interface ListMisskonParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: ResourceStatus;
  tagId?: number;
}

export interface UpdateMisskonParams {
  id: number;
}
