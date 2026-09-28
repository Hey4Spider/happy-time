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
  All = 0,
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

export interface RespMisskon {
  id: number;
  name: string;
  key: string;
  status: 0 | 1 | 2 | 3 | 4 | 5;
  url: string;
  link: string;
}

export interface UpdateMisskonDto {
  status?: ResourceStatus;
}

export interface RespLogin {
  status: boolean;
}

export interface LoginDto {
  password: string;
}

export interface RespWorkspace {
  key: string;
  path: string;
  trash: string;
  isActive: boolean;
}

export interface CreateWorkspaceDto {
  key: string;
  path: string;
  trash: string;
}

export interface UpdateWorkspaceDto {
  path?: string;
  trash?: string;
}

export interface ListImageParams {
  workspace: string;
  folder?: string;
}

export interface RemoveImageParams {
  workspace: string;
  image: string;
  force?: boolean;
  /** @default 1 */
  count?: number;
}

export interface PreviewImageParams {
  workspace: string;
  image: string;
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

export interface GetWorkspaceParams {
  key: string;
}

export interface UpdateWorkspaceParams {
  key: string;
}

export interface RemoveWorkspaceParams {
  key: string;
}
