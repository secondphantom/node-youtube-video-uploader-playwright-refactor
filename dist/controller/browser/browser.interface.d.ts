import { ResponseDto } from "../../application/dto/response.dto";
import { ReloadPageDto } from "../../application/interfaces/browser.instance";
export interface BrowserControllerInterface {
    reloadPage: (dto: ReloadPageDto) => Promise<ResponseDto>;
}
export interface BrowserValidatorControllerInterface {
    reloadPage: (dto: ReloadPageDto) => Promise<ResponseDto>;
}
export interface BrowserValidatorInterface {
    reloadPage: (dto: ReloadPageDto) => ReloadPageDto;
}
