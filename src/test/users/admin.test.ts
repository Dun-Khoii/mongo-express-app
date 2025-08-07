// // user.test.ts
// import request from "supertest";
// import app from "../../app";
// import mongoose from "mongoose";
// import { User } from "../../models/User";
// import dotenv from "dotenv";
// dotenv.config();

// jest.setTimeout(30000);

// describe("User API", () => {
//   const testAdmin = {
//     name: "Test Admin",
//     email: "admin@example.com",
//     password: "abc123",
//     role: "admin",
//   };

//   let accessToken: string;
//   let refreshToken: string;

//   beforeAll(async () => {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGO_URI!, {});
//     }

//     // Đăng ký + đăng nhập để lấy token
//     await request(app).post("/api/auth/register").send(testAdmin);
//     const loginRes = await request(app)
//       .post("/api/auth/login")
//       .send({ email: testAdmin.email, password: testAdmin.password });
//     if (loginRes.statusCode !== 200) {
//       console.log("LOGIN ERROR:", loginRes.body, loginRes.text);
//     }
//     accessToken = loginRes.body.accessToken;
//     refreshToken = loginRes.body.refreshToken;
//   });

//   afterAll(async () => {
//     await User.deleteMany({ email: testAdmin.email });
//     await mongoose.connection.close();
//   });

//   it("Đăng xuất", async () => {
//     const res = await request(app)
//       .post(`/api/auth/logout`)
//       .set("Authorization", `Bearer ${accessToken}`)
//       .send({ refreshToken });
//     if (res.statusCode !== 200) {
//       console.log("LOGOUT ERROR:", res.body, res.text);
//     }
//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe("Logged Out Success!");
//   });
// });
