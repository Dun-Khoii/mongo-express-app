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
    const testAdmin = {
        name: "Test Admin",
        email: "admin@example.com",
        password: "abc123",
        role: "admin",
    };
    let accessToken;
    let refreshToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        }
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testAdmin);
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: testAdmin.email, password: testAdmin.password });
        if (loginRes.statusCode !== 200) {
            console.log("LOGIN ERROR:", loginRes.body, loginRes.text);
        }
        accessToken = loginRes.body.accessToken;
        refreshToken = loginRes.body.refreshToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.User.deleteMany({ email: testAdmin.email });
        yield mongoose_1.default.connection.close();
    }));
    it("Đăng xuất", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/auth/logout`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ refreshToken });
        if (res.statusCode !== 200) {
            console.log("LOGOUT ERROR:", res.body, res.text);
        }
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged Out Success!");
    }));
});
