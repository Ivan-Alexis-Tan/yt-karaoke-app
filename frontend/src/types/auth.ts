type UserType = {
    auth_id: string
    provider: string
    email: string
    name: string
    picture: string
    created_at: string
    role: "admin" | "user"
}

type CurrentUserResponse = UserType