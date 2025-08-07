// user.test.ts
import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { User } from "../../models/User";
import dotenv from "dotenv";
dotenv.config();

jest.setTimeout(30000);

describe("User API", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "abc123",
  };

  let accessToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI!, {});
    }

    // Đăng ký + đăng nhập để lấy token
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
      if (loginRes.statusCode !== 200) {
        console.log("LOGIN ERROR:", loginRes.body, loginRes.text);
      }
    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await mongoose.connection.close();
  });

  it("lấy thông tin người dùng hiện tại", async () => {
    const res = await request(app)
      .get(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`);
    if (res.statusCode !== 200) {
      console.log("GET PROFILE ERROR:", res.body, res.text);
    }
    expect(res.statusCode).toBe(200);
  });

  it("cập nhật tên người dùng", async () => {
    const newName = "Updated Name";

    const res = await request(app)
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: newName });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("name", newName);
  });

  it("Xóa người dùng hiện tại", async () => {
    const res = await request(app)
      .delete(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User Deleted!");
  });
});
