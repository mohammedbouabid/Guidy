import axios from "axios"

export async function updateUserProfile(data) {
  return axios.put("http://localhost:3000/api/user", data, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })
}
