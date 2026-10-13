export const BAN_REQUEST_STATUS = ["pending", "approved", "rejected"]

const adminSearchParams = {
    date_order: "recent",
    req_status: "pending",
}
export const adminDefaultSearchParams = new URLSearchParams(adminSearchParams)