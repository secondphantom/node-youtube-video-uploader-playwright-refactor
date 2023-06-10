import { ResponseDto } from "../../application/dto/response.dto";
import { LoginService } from "../../application/service/login.service";
import { LoginControllerInterface } from "./login.interface";

export class LoginController implements LoginControllerInterface {
  static instance: LoginController | undefined;

  static getInstance = (loginService: LoginService) => {
    if (this.instance) return this.instance;
    this.instance = new LoginController(loginService);
    return this.instance;
  };

  constructor(private loginService: LoginService) {}
  login = async () => {
    try {
      const result = await this.loginService.login();
      return new ResponseDto({
        payload: {
          success: true,
          data: result,
        },
      });
    } catch (error: any) {
      return new ResponseDto({
        payload: {
          success: false,
          data: {
            message: error.message,
          },
        },
      });
    }
  };
}
