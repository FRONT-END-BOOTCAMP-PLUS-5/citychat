export class User {
    constructor(
        public id: number,
        public userId: string,
        public password: string,
        public nickname: string,
        public email: string,
        public language: "ko" | "en" = "ko",
        public deletedFlag: boolean = false,
        public userRole: "user" | "admin" = "user",
    ) {}
}
