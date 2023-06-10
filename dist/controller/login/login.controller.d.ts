import { ResponseDto } from "../../application/dto/response.dto";
import { LoginService } from "../../application/service/login.service";
import { LoginControllerInterface } from "./login.interface";
export declare class LoginController implements LoginControllerInterface {
    private loginService;
    static instance: LoginController | undefined;
    static getInstance: (loginService: LoginService) => LoginController;
    constructor(loginService: LoginService);
    login: () => Promise<ResponseDto<{
        isLogin: boolean;
    }> | ResponseDto<{
        message: any;
    }>>;
}
