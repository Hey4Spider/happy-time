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
  CreateWorkspaceDto,
  GetWorkspaceParams,
  RemoveWorkspaceParams,
  RespWorkspace,
  UpdateWorkspaceDto,
  UpdateWorkspaceParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Workspaces<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Workspaces
   * @name ListWorkspace
   * @request GET:/api/v1/workspaces
   */
  listWorkspace = (params: RequestParams = {}) =>
    this.http.request<
      {
        total: number;
        list: RespWorkspace[];
      },
      any
    >({
      path: `/api/v1/workspaces`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspaces
   * @name CreateWorkspcae
   * @request POST:/api/v1/workspaces
   */
  createWorkspcae = (data: CreateWorkspaceDto, params: RequestParams = {}) =>
    this.http.request<RespWorkspace, any>({
      path: `/api/v1/workspaces`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspaces
   * @name GetWorkspace
   * @request GET:/api/v1/workspaces/{key}
   */
  getWorkspace = ({ key }: GetWorkspaceParams, params: RequestParams = {}) =>
    this.http.request<RespWorkspace, any>({
      path: `/api/v1/workspaces/${key}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspaces
   * @name UpdateWorkspace
   * @request PUT:/api/v1/workspaces/{key}
   */
  updateWorkspace = (
    { key }: UpdateWorkspaceParams,
    data: UpdateWorkspaceDto,
    params: RequestParams = {},
  ) =>
    this.http.request<RespWorkspace, any>({
      path: `/api/v1/workspaces/${key}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspaces
   * @name RemoveWorkspace
   * @request DELETE:/api/v1/workspaces/{key}
   */
  removeWorkspace = (
    { key }: RemoveWorkspaceParams,
    params: RequestParams = {},
  ) =>
    this.http.request<undefined, any>({
      path: `/api/v1/workspaces/${key}`,
      method: "DELETE",
      ...params,
    });
}
