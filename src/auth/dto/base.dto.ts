import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Response {
  statusCode: HttpStatus;
  message?: string;
  data?: any;

  constructor(statusCode: HttpStatus, message?: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(message: string, data: any): Response {
    return new Response(HttpStatus.OK, message, data);
  }

  static error(message: string, data: any): Response {
    return new Response(HttpStatus.BAD_REQUEST, message, data);
  }

  static unauthorized(message: string, data: any): Response {
    return new Response(HttpStatus.UNAUTHORIZED, message, data);
  }

  static forbidden(message: string, data: any): Response {
    return new Response(HttpStatus.FORBIDDEN, message, data);
  }

  static notFound(message: string, data: any): Response {
    return new Response(HttpStatus.NOT_FOUND, message, data);
  }

  static internalServerError(message: string, data: any): Response {
    return new Response(HttpStatus.INTERNAL_SERVER_ERROR, message, data);
  }

  static badGateway(message: string, data: any): Response {
    return new Response(HttpStatus.BAD_GATEWAY, message, data);
  }

  static serviceUnavailable(message: string, data: any): Response {
    return new Response(HttpStatus.SERVICE_UNAVAILABLE, message, data);
  }

  static gatewayTimeout(message: string, data: any): Response {
    return new Response(HttpStatus.GATEWAY_TIMEOUT, message, data);
  }

  static custom(statusCode: HttpStatus, message: string, data: any): Response {
    return new Response(statusCode, message, data);
  }
}

export class RestFindDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  limit?: string;
}

export class RestFindResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}
