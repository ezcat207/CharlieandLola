export function respData(data: any) {
  return respJson(0, "ok", data || []);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string, data?: any) {
  return respJson(-1, message, data);
}

export function respJson(code: number, message: string, data?: any) {
  let json: { code: number; message: string; data?: any } = {
    code: code,
    message: message,
  };
  if (data) {
    json.data = data;
  }

  return Response.json(json);
}