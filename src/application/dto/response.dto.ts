export class ResponseDto<T = any> {
  private _payload: {
    success: boolean;
    data: T;
  };

  constructor({
    payload,
  }: {
    payload: {
      success: boolean;
      data: T;
    };
  }) {
    this._payload = payload;
  }

  get payload() {
    return this._payload;
  }
}
