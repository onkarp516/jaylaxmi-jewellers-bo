export function authHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    // "Content-Type": "text/html; charset=utf-8",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Headers":
    //   "Origin, X-Requested-With, Content-Type, Accept",
    // "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    // "Access-Control-Allow-Credentials": "true",
  };
}

export function authLogin() {
  return {
    "Content-Type": "application/json",
  };
}

export function getHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    Authorization: `Bearer ${token}`,
    // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2aW4iLCJpc3MiOiIvYXV0aGVudGljYXRlIiwiaW5zdGl0dXRlSWQiOjE0LCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJpc0FkbWluIjp0cnVlLCJleHAiOjE2OTMyODM3MjAsInVzZXJJZCI6NSwidXNlcm5hbWUiOiJ2aW4iLCJzdGF0dXMiOiJPSyJ9.Owaiy2LKxRJpOP4uF8CfoY-igxm3UNS3ed-3B7gc1Xk`,
    "Content-Type": "application/json",
  };
}

export function fileHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    "Content-Type":
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    Authorization: `Bearer ${token}`,
  };
}
