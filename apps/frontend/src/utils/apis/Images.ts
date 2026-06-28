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

import {
  ListImageParams,
  MergeImageDto,
  OperateWorkspaceDto,
  RemoveImageParams,
  RespResource,
  RespWorkspace,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Images<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Images
   * @name ListImage
   * @request GET:/api/v1/images
   */
  listImage = (query: ListImageParams, params: RequestParams = {}) =>
    this.http.request<
      {
        total: number;
        list: RespResource[];
      },
      any
    >({
      path: `/api/v1/images`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Images
   * @name RemoveImage
   * @request DELETE:/api/v1/images
   */
  removeImage = (query: RemoveImageParams, params: RequestParams = {}) =>
    this.http.request<undefined, any>({
      path: `/api/v1/images`,
      method: "DELETE",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Images
   * @name ListWorkspace
   * @request GET:/api/v1/images/workspaces
   */
  listWorkspace = (params: RequestParams = {}) =>
    this.http.request<
      {
        total: number;
        list: RespWorkspace[];
      },
      any
    >({
      path: `/api/v1/images/workspaces`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Images
   * @name OperateWorkspcae
   * @request POST:/api/v1/images/workspace
   */
  operateWorkspcae = (data: OperateWorkspaceDto, params: RequestParams = {}) =>
    this.http.request<undefined, any>({
      path: `/api/v1/images/workspace`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Images
   * @name MergeImage
   * @request POST:/api/v1/images/merge
   */
  mergeImage = (data: MergeImageDto, params: RequestParams = {}) =>
    this.http.request<File, any>({
      path: `/api/v1/images/merge`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Images
   * @name RevokeImage
   * @request POST:/api/v1/images/revoke
   */
  revokeImage = (params: RequestParams = {}) =>
    this.http.request<undefined, any>({
      path: `/api/v1/images/revoke`,
      method: "POST",
      ...params,
    });
}
