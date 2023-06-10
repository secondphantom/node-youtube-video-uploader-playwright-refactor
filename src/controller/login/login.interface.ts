import { ResponseDto } from "../../application/dto/response.dto";

export interface LoginControllerInterface {
  login: () => Promise<ResponseDto>;
}
