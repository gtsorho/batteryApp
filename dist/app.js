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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./backend_src/routes/user"));
const batteryCharge_1 = __importDefault(require("./backend_src/routes/batteryCharge"));
const client_1 = __importDefault(require("./backend_src/routes/client"));
const models_1 = __importDefault(require("./backend_src/models"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Use express.json() to parse JSON payloads
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded data
// API Routes
app.use('/api/users', user_1.default);
app.use('/api/battery_charge', batteryCharge_1.default);
app.use('/api/clients', client_1.default);
// Path to the Angular app's build output
const angularDistDir = path_1.default.join(__dirname, '../batteryUi/dist/browser');
// Serve static files from the Angular app's build output directory
app.use(express_1.default.static(angularDistDir));
// Catch-all route to serve Angular's index.html for non-API routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(angularDistDir, 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Closing database connection...');
    yield models_1.default.close();
    console.log('Database connection closed.');
    process.exit(0);
}));
