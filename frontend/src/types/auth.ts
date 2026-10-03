type CurrentUserResponse = {
    auth_id: string
    provider: string
    email: string
    name: string
    picture: string
    created_at: string
    role: "admin" | "user"
}