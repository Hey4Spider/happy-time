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
  ListMisskonParams,
  ListMisskonTagParams,
  RespMisskonTag,
  UpdateMisskonDto,
  UpdateMisskonParams,
  UpdateMisskonTagDto,
  UpdateMisskonTagParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Misskon<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Misskon
   * @name ListMisskonTag
   * @request GET:/api/v1/misskon/tags
   */
  listMisskonTag = (
    query: ListMisskonTagParams = {},
    params: RequestParams = {},
  ) =>
    this.http.request<
      {
        total: number;
        list: RespMisskonTag[];
      },
      any
    >({
      path: `/api/v1/misskon/tags`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Misskon
   * @name UpdateMisskonTag
   * @request PUT:/api/v1/misskon/tags/{id}
   */
  updateMisskonTag = (
    { id }: UpdateMisskonTagParams,
    data: UpdateMisskonTagDto,
    params: RequestParams = {},
  ) =>
    this.http.request<undefined, any>({
      path: `/api/v1/misskon/tags/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Misskon
   * @name ListMisskon
   * @request GET:/api/v1/misskon
   */
  listMisskon = (query: ListMisskonParams = {}, params: RequestParams = {}) =>
    this.http.request<
      {
        total: number;
        list: RespMisskonTag[];
      },
      any
    >({
      path: `/api/v1/misskon`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Misskon
   * @name UpdateMisskon
   * @request PUT:/api/v1/misskon/{id}
   */
  updateMisskon = (
    { id }: UpdateMisskonParams,
    data: UpdateMisskonDto,
    params: RequestParams = {},
  ) =>
    this.http.request<undefined, any>({
      path: `/api/v1/misskon/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
