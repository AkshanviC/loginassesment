import crypto from "crypto";
import userModel from "../models/users.js";
import mongoose from "mongoose";
//signup
export const signup = async ({ username, password, userRole }) => {
  if (username && password) {
    try {
      let user = await userModel.create({
        username: username,
        password: password,
        loginLimit: 1,
        token: "",
        loginTime: "",
        attempts: 3,
        loginCount: 1,
        userRole: userRole,
      });
      if (user) {
        return {
          status: 200,
          success: true,
          message: "user created successfully",
        };
      } else {
        return {
          status: 400,
          success: false,
          message: "user already exist",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        success: false,
        message: "user already exist",
      };
    }
  }
};
//login
export const login = async ({ username, password }) => {
  let user = await userModel.findOne({ username: username });
  if (user) {
    if (user.attempts) {
      if (user.password === password) {
        if (user.loginLimit) {
          await userModel.findOneAndUpdate(
            { username: username },
            { loginLimit: 0 }
          );
          return {
            success: true,
            userId: user._id,
            url: `https://localhost:5000/api/getToken/${user._id}`,
          };
        } else {
          return {
            success: false,
            status: 401,
            message: "only 1 device can login at a time",
          };
        }
      } else {
        await userModel.findOneAndUpdate(
          { username: username },
          { attempts: user.attempts - 1 }
        );
        return {
          success: false,
          status: 401,
          message: `Passwoard doesn't match. You have only ${attempts} attempts`,
        };
      }
    } else {
      return {
        success: false,
        status: 401,
        message: `login attempts limit reached. contact admin`,
      };
    }
  } else {
    return {
      success: false,
      status: 401,
      message: "Username doesn't exist",
    };
  }
};

//gettime
export const getTime = async (id) => {
  let userid = new mongoose.Types.ObjectId(id);
  let current = new Date();
  let user = await userModel.findById({ _id: userid });
  if (user.loginTime > current) {
    await userModel.findOneAndUpdate(
      { _id: user },
      { token: "", loginTime: "", attempts: 3, loginLimit: 1 }
    );
    return {
      status: 401,
      message: "Session expired. login again",
    };
  } else {
    console.log(user.loginTime, current);
    return {
      status: 200,
      message: "session not expired",
      user: user,
    };
  }
};

//gettoken
export const getToken = async (id) => {
  let userid = new mongoose.Types.ObjectId(id);

  const today = new Date();
  const date = new Date(today.getTime() + 30 * 60 * 1000);
  const user = await userModel.findById({ _id: userid });
  console.log(date, "date");
  let token = crypto.randomUUID();
  if (!user.token) {
    await userModel.findOneAndUpdate(
      { _id: user },
      { token: token, loginTime: date }
    );
    return { token: token, user: user, loginTime: date };
  } else {
    return {
      status: 400,
      success: false,
      message: "url already used",
      loginTime: date,
      today: today,
    };
  }
};

//kickout
export const kickout = async ({ username }) => {
  const user = userModel.findOneAndUpdate(
    { username: username },
    { token: "", loginTime: "", attempts: 3, loginCount: 1 }
  );
  if (user) {
    return {
      staus: 200,
      message: "user kicked out",
    };
  } else {
    return {
      status: 400,
      message: "Something went wrong",
    };
  }
};
