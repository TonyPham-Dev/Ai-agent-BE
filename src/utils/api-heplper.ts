import { Response } from "@auth/dto/base.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { array, object, number, string } from "is-js";
import { assocPath } from "ramda";
const handleRequest = async (params: {
    action: () => Promise<any>,
    successMessage?: string,
    statusCode?: HttpStatus,
    errorMessage?: string,
    errorStatus?: HttpStatus
  }): Promise<Response> => {
    const { action, successMessage, statusCode = HttpStatus.OK, errorMessage, errorStatus = HttpStatus.BAD_REQUEST } = params;
    try {
      const data = await action();
      return new Response(statusCode, successMessage, data);
    } catch (err) {
      throw new HttpException(errorMessage || err.message, errorStatus);
    }
  }
  
  export const apiHelper = {
    handleRequest
  };