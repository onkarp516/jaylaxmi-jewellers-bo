import { BehaviorSubject } from "rxjs";

import { handleLoginResponse, History, HandleResponse } from "@/helpers";

import { loginURL } from "../api";
import jwt_decode from "jwt-decode";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("loginUser"))
);

const currentUserToken = new BehaviorSubject(
  JSON.parse(localStorage.getItem("loginUser"))
);
export const AuthenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  get currentUserToken() {
    // console.log("currentUserToken",currentUserToken.value)
    return currentUserToken.value;
  },
  setAccessRefreshToken, // if token expired code
};

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(loginURL(), requestOptions)
    .then(handleLoginResponse)
    .then((response) => { 
      console.log("Login response", { response });
      let result = response;
      console.log("Login response", result);

      if (result.responseStatus == 200) {
        console.log(
          "response.responseObject.access_token ",
          result.response.access_token
        );
        let decoded = jwt_decode(result.response.access_token);
        console.log("decoded ", decoded);

        decoded["token"] = response.response.access_token;
        // console.log("decoded====>", JSON.stringify(decoded));

        decoded["accessToken"] = result.response.access_token;
        // console.log("decoded====>", JSON.stringify(decoded));
        localStorage.setItem("loginUser", JSON.stringify(decoded));
        localStorage.setItem("refreshToken", result.response.refresh_token);
        currentUserSubject.next(decoded);
        currentUserToken.next(response.response);
        return decoded;
      } else {
        return response;
      }
    });
}

function logout() {
  // remove user from local storage to log user out
  // localStorage.removeItem("currentUser");
  localStorage.clear();
  currentUserSubject.next(null);
  currentUserToken.next(null);
  History.push("/");
}

// if token expired then this code will work
function setAccessRefreshToken(res) {
  let decoded = jwt_decode(res.access_token);
  // console.log("decoded ", decoded);

  decoded["token"] = res.access_token;
  // console.log("decoded====>", JSON.stringify(decoded));

  decoded["accessToken"] = res.access_token;
  // console.log("decoded====>", JSON.stringify(decoded));
  localStorage.setItem("loginUser", JSON.stringify(decoded));
  localStorage.setItem("refreshToken", res.refresh_token);
  localStorage.setItem("authenticationService", res.access_token);
  currentUserSubject.next(decoded);
  currentUserToken.next(res);
  return decoded;
}
