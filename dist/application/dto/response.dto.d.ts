export declare class ResponseDto<T = any> {
    private _payload;
    constructor({ payload, }: {
        payload: {
            success: boolean;
            data: T;
        };
    });
    get payload(): {
        success: boolean;
        data: T;
    };
}
