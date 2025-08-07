"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.setTimeout(30000);
describe("User API", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "abc123",
    };
    let accessToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        }
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        if (loginRes.statusCode !== 200) {
            console.log("LOGIN ERROR:", loginRes.body, loginRes.text);
        }
        accessToken = loginRes.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.User.deleteMany({ email: testUser.email });
        yield mongoose_1.default.connection.close();
    }));
    it("lấy thông tin người dùng hiện tại", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/user/me`)
            .set("Authorization", `Bearer ${accessToken}`);
        if (res.statusCode !== 200) {
            console.log("GET PROFILE ERROR:", res.body, res.text);
        }
        expect(res.statusCode).toBe(200);
    }));
    it("cập nhật tên người dùng", () => __awaiter(void 0, void 0, void 0, function* () {
        const newName = "Updated Name";
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/user/me`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: newName });
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("name", newName);
    }));
    it("Xóa người dùng hiện tại", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/user/me`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User Deleted!");
    }));
});
